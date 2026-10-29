const fs = require('fs');
const path = require('path');

function createPcap() {
  const pcapPath = path.join(__dirname, '..', '..', 'challenges', 'network', 'net-01-wireshark-ftp', 'files', 'ftp_session_capture.pcap');

  // Global header 24 bytes
  const globalHeader = Buffer.alloc(24);
  globalHeader.writeUInt32LE(0xa1b2c3d4, 0); // Magic
  globalHeader.writeUInt16LE(2, 4);          // Major
  globalHeader.writeUInt16LE(4, 6);          // Minor
  globalHeader.writeInt32LE(0, 8);           // Timezone
  globalHeader.writeUInt32LE(0, 12);         // Sigfigs
  globalHeader.writeUInt32LE(65535, 16);     // Snaplen
  globalHeader.writeUInt32LE(1, 20);         // Linktype: Ethernet (1)

  const packets = [];
  let currentTime = 1730000000;

  function addPacket(srcIp, dstIp, srcPort, dstPort, dataStr) {
    const payload = Buffer.from(dataStr, 'utf8');

    // TCP header (20 bytes)
    const tcp = Buffer.alloc(20 + payload.length);
    tcp.writeUInt16BE(srcPort, 0);
    tcp.writeUInt16BE(dstPort, 2);
    tcp.writeUInt32BE(1000 + packets.length * 100, 4); // Seq
    tcp.writeUInt32BE(0, 8); // Ack
    tcp.writeUInt8(0x50, 12); // Data offset (5 * 4 = 20)
    tcp.writeUInt8(0x18, 13); // Flags: PSH, ACK
    tcp.writeUInt16BE(64240, 14); // Window
    payload.copy(tcp, 20);

    // IPv4 header (20 bytes)
    const ip = Buffer.alloc(20 + tcp.length);
    ip.writeUInt8(0x45, 0); // Version 4, IHL 5
    ip.writeUInt8(0x00, 1); // DSCP
    ip.writeUInt16BE(20 + tcp.length, 2); // Total length
    ip.writeUInt16BE(packets.length + 1, 4); // ID
    ip.writeUInt16BE(0x4000, 6); // Flags: Don't fragment
    ip.writeUInt8(64, 8); // TTL
    ip.writeUInt8(6, 9); // Protocol: TCP (6)

    // IP addresses
    const srcParts = srcIp.split('.').map(Number);
    const dstParts = dstIp.split('.').map(Number);
    for (let i = 0; i < 4; i++) {
      ip.writeUInt8(srcParts[i], 12 + i);
      ip.writeUInt8(dstParts[i], 16 + i);
    }
    tcp.copy(ip, 20);

    // Ethernet header (14 bytes)
    const eth = Buffer.alloc(14 + ip.length);
    eth.write('001122334455', 0, 6, 'hex'); // Dest MAC
    eth.write('66778899aabb', 6, 6, 'hex'); // Src MAC
    eth.writeUInt16BE(0x0800, 12); // Ethertype IPv4
    ip.copy(eth, 14);

    // PCAP Record Header (16 bytes)
    const recHeader = Buffer.alloc(16);
    recHeader.writeUInt32LE(currentTime++, 0);
    recHeader.writeUInt32LE(12345, 4);
    recHeader.writeUInt32LE(eth.length, 8);
    recHeader.writeUInt32LE(eth.length, 12);

    packets.push(Buffer.concat([recHeader, eth]));
  }

  // Conversation FTP réaliste
  addPacket('192.168.1.50', '192.168.1.10', 49210, 21, '220 Aegis Defense Secure FTP Service Ready.\r\n');
  addPacket('192.168.1.10', '192.168.1.50', 21, 49210, 'USER operator\r\n');
  addPacket('192.168.1.50', '192.168.1.10', 49210, 21, '331 Password required for operator.\r\n');
  addPacket('192.168.1.10', '192.168.1.50', 21, 49210, 'PASS FalconSecure#2026\r\n');
  addPacket('192.168.1.50', '192.168.1.10', 49210, 21, '230 User logged in, proceed.\r\n');
  addPacket('192.168.1.10', '192.168.1.50', 21, 49210, 'RETR secret_operations_directive.txt\r\n');
  addPacket('192.168.1.50', '192.168.1.10', 49210, 21, '150 Opening BINARY mode data connection.\r\n');
  // Data connection
  addPacket('192.168.1.50', '192.168.1.10', 50021, 49211, '[CONFIDENTIAL DATA STREAM]\nFICHIER: secret_operations_directive.txt\nAUTEUR: Division Renseignement\nFLAG=CYBERLAB{FTP_CLEARTEXT_CREDENTIALS_AND_PAYLOAD_CAPTURED}\nFIN DU RAPPORT.\n');

  const totalBuffer = Buffer.concat([globalHeader, ...packets]);
  fs.writeFileSync(pcapPath, totalBuffer);
  console.log('✔ ftp_session_capture.pcap generated successfully (' + totalBuffer.length + ' bytes)');
}

createPcap();
