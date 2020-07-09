## Junior High School

I learned how to make a quiz game on a site for super beginners. The language used is Java. This was my first programming.

Here, I write an input process that was particularly interesting.

```
try {	 
    final int IMPUT_MAX = 3; //Max Value
    //Keyboard reading process
    java.util.Scanner sc = new java.util.Scanner(System.in);	 
    int inputInt = sc.nextInt();	 
    //Check and subsititution
    if (inputInt > 0 && inputInt <= IMPUT_MAX) {	 
        tmpInputNum = inputInt;	 
    } else {	 
        System.out.println("Over limit!");	 
    }	 
} catch (Exception e) {	 
    System.out.println("Please enter only numbers!");	 
}
```

### Reference
- [Learning site (English)](http://www.gamecradle.net/en/document/main/content/doki/index.html)
- [Learning site (Japanese)](http://www.gamecradle.net/document/main/content/doki/introduction.html)


[![back](https://github.com/7vvXi/portfolio/raw/master/images/back.png)](https://7vvxi.github.io/portfolio/)
