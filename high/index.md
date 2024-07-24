## High School

In high school, I began to learn from assembly language, and I learned C, C ++, and Java languages.

### Shopping Site
<a class="zip_download_link" href="https://github.com/snoow-sub/portfolio/raw/master/high/shopping.zip">Download this project as a .zip file</a>

I made a shopping site as one of the lesson subjects. 
Here, we will fix the code and publish the data uploaded to the rental server.

From [here](http://tibineko923.starfree.jp/shopping/) if you want to login.

[![Shopping Site Image](https://github.com/snoow-sub/portfolio/raw/master/images/shop_pic.png)](http://tibineko923.starfree.jp/shopping/)


### C language Program 

#### Tower of Hanoi 
<a class="zip_download_link" href="https://github.com/snoow-sub/portfolio/raw/master/high/Hanoi.zip">Download this project as a .zip file</a>
What is the tower of Hanoi?
>https://en.wikipedia.org/wiki/Tower_of_Hanoi

![Tower of Hanoi Image](https://github.com/snoow-sub/portfolio/raw/master/images/hanoi.gif)

Please specify the number on the command line.

```
void Hanoi(int n, char from, char work, char to)
{
  if (n > 0) {
    Hanoi(n-1, from, to, work);
    // Output from → to
    Hanoi(n-1, work, from, to);
  }
  return;
}
```
Here is the function I implemented.
From the Tower of Hanoi, I learned many things such as basic syntax, sorting, arrays, 
string operations, search methods, recursion, file operations, links, and more.

### Android Java Program

Challenged to color identification by Android camera.
<a class="zip_download_link" href="https://github.com/snoow-sub/portfolio/raw/master/high/Camera_color.zip">Download this project as a .zip file</a>
The installation procedure is as follows.
 1. Take a picture
 2. Import an image as a bitmap
 3. Get RGB value of specified range
 4. Identify the color from the ratio of Red, Green and Blue
 
<a class="zip_download_link" href="https://github.com/snoow-sub/portfolio/raw/master/high/Camera_target.zip">Download this project as a .zip file</a>
If you save, load, or acquire RGB values while the camera is in use, it may freeze. 
Therefore, it is not possible to press the shutter until a series of processing is completed.

I created a target hitting game using this.
Point the camera to a target image, release the shutter, and points will be added.

### Group programming

Comming Sonn...


[![back](https://github.com/snoow-sub/portfolio/raw/master/images/back.png)](https://snoow-sub.github.io/portfolio/)
