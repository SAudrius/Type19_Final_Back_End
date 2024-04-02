### Back end

Get started

1. Add Variables for db
2. If localhost change to dbConfig not dbConfigremote 

`npm run ts`<br/>

`npm run dev`



### For development

Used for eslint rule sort imports to automaticaly format code on save 

`mkdir .vscode`</br>

`cd .vscode`</br>

`touch settings.json`</br>
```
echo '{
      "editor.codeActionsOnSave": {
          "source.fixAll.eslint": "explicit"
    }
}' > settings.json
```