Get-ChildItem -Recurse -Filter package.json | 
    Select-String -Pattern '"workspace:' | 
    Select Path, LineNumber, Line
