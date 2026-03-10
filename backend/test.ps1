$token = (Invoke-RestMethod -Method Post -Uri 'http://localhost:5000/api/auth/login' -Body (@{email='user@demo.com';password='password123'} | ConvertTo-Json) -ContentType 'application/json').token

$filePath = "test.txt"
$boundary = [System.Guid]::NewGuid().ToString()

# Build multipart/form-data payload
$LF = "`r`n"
$bodyLines = @(
    "--$boundary",
    "Content-Disposition: form-data; name=`"document`"; filename=`"test.txt`"",
    "Content-Type: text/plain",
    "",
    "Hello World",
    "--$boundary",
    "Content-Disposition: form-data; name=`"title`"",
    "",
    "test.txt",
    "--$boundary",
    "Content-Disposition: form-data; name=`"approverEmail`"",
    "",
    "approver@demo.com",
    "--$boundary",
    "Content-Disposition: form-data; name=`"isUrgent`"",
    "",
    "true",
    "--$boundary--"
) -join $LF

Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/documents" `
    -Headers @{ Authorization = "Bearer $token" } `
    -ContentType "multipart/form-data; boundary=$boundary" `
    -Body $bodyLines
