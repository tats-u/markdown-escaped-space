# CommonMark Escaped Space Extension Specification

## 2.4 Backslash escapes


Any ASCII punctuation character may be backslash-escaped:

```````````````````````````````` example
\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~
.
<p>!&quot;#$%&amp;'()*+,-./:;&lt;=&gt;?@[\]^_`{|}~</p>
````````````````````````````````


Backslashes before other characters ***<ins>except space</ins>*** are treated as literal
backslashes:

```````````````````````````````` example
\→\A\a\ \3\φ\«
.
<p>\→\A\a\ \3\φ\«</p>
````````````````````````````````

***<ins>If only one space follows a backslash, it and the preceding backslash are removed.</ins>***

```````````````````````````````` example
太郎は\ **「こんにちわ」**\ といった。

<p>太郎は<strong>「こんにちわ」</strong>といった。</p>
````````````````````````````````


***<ins>If two spaces follow a backslash, they are replaced by a non-breaking space (U+00A0).</ins>***

```````````````````````````````` example
100\  km
.
<p>100&nbsp;km</p>
````````````````````````````````

## 4.8 Paragraphs

Final spaces or tabs ***<ins>except for one or two spaces following a backslash</ins>*** are stripped before inline parsing, so a paragraph that ends with two or more spaces will not end with a hard line break:

```````````````````````````````` example
aaa\ 
bbb\ 
.
<p>aaa
bbb</p>
````````````````````````````````

````````````````````````````````` example
aaa\  
bbb\  

ccc\   
ddd\   
.
<p>aaa&nbsp;
bbb&nbsp;</p>
<p>ccc&nbsp;
ddd&nbsp;</p>
`````````````````````````````````

````````````````````````````````` example
aaa\    
bbb\    

ccc\     
ddd\     
.
<p>aaa&nbsp;<br>
bbb&nbsp;</p>
<p>ccc&nbsp;<br>
ddd&nbsp;</p>
`````````````````````````````````
