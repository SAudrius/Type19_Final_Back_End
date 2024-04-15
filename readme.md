### Back end

Get started

1. Add Variables for db
2. If localhost database change to dbConfig not dbConfigremote in config.ts dir
3. Add env varibles from env.example

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