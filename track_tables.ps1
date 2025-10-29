$tables = @('students', 'plans', 'modalities', 'student_plans', 'payments', 'users', 'academy_settings', 'classes', 'instructors', 'attendance', 'payment_methods', 'equipment', 'maintenance')
$adminSecret = 'd7f9a1c2e8b34fa5d16c7b20e5319a44c8e1f72ad9c4b0e6f3a2d1c5b7e9a0d4'
$endpoint = 'http://localhost:8080/v1/metadata'

Write-Host "Tracking tables in Hasura..." -ForegroundColor Cyan

foreach ($table in $tables) {
  Write-Host "Tracking table: $table"
  $body = @{
    type = 'pg_track_table'
    args = @{
      source = 'default'
      table = @{
        schema = 'public'
        name = $table
      }
    }
  } | ConvertTo-Json -Depth 10

  try {
    $result = Invoke-RestMethod -Uri $endpoint -Method Post -Headers @{'x-hasura-admin-secret'=$adminSecret; 'Content-Type'='application/json'} -Body $body
    Write-Host "  Tracked successfully!" -ForegroundColor Green
  } catch {
    Write-Host "  Error: $_" -ForegroundColor Yellow
  }
}

Write-Host "`nDone! Refresh your browser." -ForegroundColor Cyan
