Add-Type -AssemblyName System.Drawing

$photos = @(
  @{ Source = 'D:\848676829_1034470882985134_3437859757509171659_n.jpg'; Name = 'community-talk.jpg'; Y = 394; Height = 1261 },
  @{ Source = 'D:\848306440_1587758226165621_8934088341377947221_n.jpg'; Name = 'school-gathering.jpg'; Y = 668; Height = 713 },
  @{ Source = 'D:\850154662_1424401176499000_7510032178662471527_n.jpg'; Name = 'site-visit.jpg'; Y = 394; Height = 1261 },
  @{ Source = 'D:\844277488_1112164425008958_1615208770657259397_n.jpg'; Name = 'classroom-session.jpg'; Y = 758; Height = 532 },
  @{ Source = 'D:\845217001_1080846784752236_5875255900899629482_n.jpg'; Name = 'team-visit.jpg'; Y = 394; Height = 1261 }
)

foreach ($photo in $photos) {
  $source = [System.Drawing.Bitmap]::FromFile($photo.Source)
  try {
    $rectangle = New-Object System.Drawing.Rectangle(0, $photo.Y, $source.Width, $photo.Height)
    $crop = $source.Clone($rectangle, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    try {
      $destination = Join-Path $PSScriptRoot ('assets\' + $photo.Name)
      $crop.Save($destination, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    } finally {
      $crop.Dispose()
    }
  } finally {
    $source.Dispose()
  }
}
