param([Parameter(Mandatory=$true)][string]$Cache)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Storage.StorageFile,Windows.Storage,ContentType=WindowsRuntime]
$null = [Windows.Graphics.Imaging.BitmapDecoder,Windows.Graphics.Imaging,ContentType=WindowsRuntime]
$null = [Windows.Media.Ocr.OcrEngine,Windows.Foundation,ContentType=WindowsRuntime]
$null = [Windows.Globalization.Language,Windows.Globalization,ContentType=WindowsRuntime]
$asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
function Await-Operation($operation, $type) {
 $task = $asTask.MakeGenericMethod($type).Invoke($null, @($operation))
 $task.Wait()
 return $task.Result
}
$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage([Windows.Globalization.Language]::new('ko'))
if(-not $engine){throw 'Install the Korean OCR language pack in Windows before running this script.'}
$directory = Join-Path (Resolve-Path -LiteralPath $Cache).Path 'pages'
foreach($path in Get-ChildItem -LiteralPath $directory -Filter '*.png') {
 $output = [IO.Path]::ChangeExtension($path.FullName, '.json')
 if(Test-Path -LiteralPath $output){continue}
 $file = Await-Operation ([Windows.Storage.StorageFile]::GetFileFromPathAsync($path.FullName)) ([Windows.Storage.StorageFile])
 $stream = Await-Operation ($file.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
 $decoder = Await-Operation ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
 $bitmap = Await-Operation ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
 $result = Await-Operation ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])
 $lines = @($result.Lines | ForEach-Object { @{text=$_.Text; words=@($_.Words | ForEach-Object { @{text=$_.Text;x=$_.BoundingRect.X;y=$_.BoundingRect.Y;width=$_.BoundingRect.Width;height=$_.BoundingRect.Height} })} })
 @{lines=$lines;width=$bitmap.PixelWidth;height=$bitmap.PixelHeight} | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $output -Encoding UTF8
 $bitmap.Dispose();$stream.Dispose()
 Write-Output $path.BaseName
}
