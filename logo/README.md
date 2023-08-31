## Split the image into chunks and then generate a font from them.
```
convert logo/logo-small.svg -crop 32x32 +repage +adjoin tiles/tile-%d.svg
./svg2ttf config.json
```
