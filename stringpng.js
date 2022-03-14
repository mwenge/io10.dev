function stringToPNG(string, fileType) {
  function isWhiteSpace(s) { return /\s/g.test(s); }
  function isTab(s) { return /\t/g.test(s); }
  function isLineEnd(s) { return /\n/g.test(s); }
  
  const columns = 80;
  const rows = 40;
  const blankRows = 80;
  const margin = 10;
  const pixelWidth = 1;

  let canvas = document.createElement('canvas');
  canvas.width = margin + (columns * pixelWidth) + margin;
  canvas.height = margin + (rows * pixelWidth) + blankRows + margin;
  let ctx = canvas.getContext('2d', {alpha: false});
  ctx.fillStyle = 'orange';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add the file type
  ctx.font = '22px serif';
  ctx.fillStyle = 'black';
  console.log(fileType);
  ctx.fillText(fileType, 50, 120);


  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  let curLine = margin;
  let curImgDataIndex = ((canvas.width * curLine) + margin) * 4;
  const lines = string.split('\n');
  for (const line of lines) {
    for (let i = 0; i < line.length && i < columns; i++) {
      let c = line[i];
      if (isTab(c)) {
        curImgDataIndex += (4 * 4);
        continue;
      }
      if (isWhiteSpace(c)) {
        curImgDataIndex += 4;
        continue;
      }
      // Set the pixel to black
      [0,1,2].forEach(x => { data[curImgDataIndex + x] = 0; });
      curImgDataIndex += 4;
    }
    curLine += 2;
    curImgDataIndex = ((canvas.width * curLine) + margin) * 4;
  }

  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL();
}

async function convertStringToPngTest(code) {
  const guessLang = new GuessLang();
  const result = await guessLang.runModel(code);
  const fileType = (result.length) ? "*." + result[0].languageId : "";
  let pngData = stringToPNG(code, fileType);

  var imgToAdd = document.createElement('img');
  imgToAdd.src = pngData;
  container.appendChild(imgToAdd);
  container.innerHTML += "<br>"
  container.innerHTML += ((result == '2c' ? 'Pass. ' : 'FAIL. ') + 'Detect CSV ' + '. Actual result:', pngData);

}

function testString() {
  let string = "a,b,c\n1,2,3\n4,5,6jk\tldsajkl";
  convertStringToPngTest(string);

  string = `
  struct Rectangle {
      width: u32,
        height: u32,
  }

  fn main() {
      let rect1 = Rectangle {
            width: 30,
              height: 50,
            };

      println!(
            "The area of the rectangle is {} square pixels.",
            area(&rect1)
          );
  }

  fn area(rectangle: &Rectangle) -> u32 {
      rectangle.width * rectangle.height
  }
  `;
  convertStringToPngTest(string);

  string = `
  l = [1,2,3]
  print(l)
  if l:
    print("ok")
  `;
  convertStringToPngTest(string);


  string = `
ds,ds,ds,ds
ds,ds,ds,ds
ds,ds,ds,ds
ds,ds,ds,ds
ds,ds,ds,ds
ds,ds,ds,ds
  `;
  convertStringToPngTest(string);

  string = `
ds	ds	ds	ds
ds	ds	ds	ds
ds	ds	ds	ds
ds	ds	ds	ds
ds	ds	ds	ds
ds	ds	ds	ds
  `;
  convertStringToPngTest(string);

  string = `
  struct Rectangle {
      width: u32,
        height: u32,
  }

  fn main() {
      let rect1 = Rectangle {
            width: 30,
              height: 50,
            };

      println!(
            "The area of the rectangle is {} square pixels.",
            area(&rect1)
          );
  }

  fn area(rectangle: &Rectangle) -> u32 {
      rectangle.width * rectangle.height
  }
  struct Rectangle {
      width: u32,
        height: u32,
  }

  fn main() {
      let rect1 = Rectangle {
            width: 30,
              height: 50,
            };

      println!(
            "The area of the rectangle is {} square pixels.",
            area(&rect1)
          );
  }

  fn area(rectangle: &Rectangle) -> u32 {
      rectangle.width * rectangle.height
  }
  struct Rectangle {
      width: u32,
        height: u32,
  }

  fn main() {
      let rect1 = Rectangle {
            width: 30,
              height: 50,
            };

      println!(
            "The area of the rectangle is {} square pixels.",
            area(&rect1)
          );
  }

  fn area(rectangle: &Rectangle) -> u32 {
      rectangle.width * rectangle.height
  }
  struct Rectangle {
      width: u32,
        height: u32,
  }

  fn main() {
      let rect1 = Rectangle {
            width: 30,
              height: 50,
            };

      println!(
            "The area of the rectangle is {} square pixels.",
            area(&rect1)
          );
  }

  fn area(rectangle: &Rectangle) -> u32 {
      rectangle.width * rectangle.height
  }
  `;
  convertStringToPngTest(string);
}
