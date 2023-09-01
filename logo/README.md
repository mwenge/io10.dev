## Split the image into chunks and then generate a font from them.
```
convert logo/logo-small.svg -crop 32x32 +repage +adjoin tiles/tile-%d.svg
./svg2ttf config.json
```

Then in FontForge go to Element->Font Info->OS/2->Metrics and change 'Typo
Line Gap' and 'HHead Line Gap' to -10.
