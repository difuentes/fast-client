# Fast Client Boilerplate

> WIP

## EOL Problems (CRLF but LF expected)

https://stackoverflow.com/questions/7068179/convert-line-endings-for-whole-directory-tree-git

find src -type f -print0 | xargs -0 dos2unix
