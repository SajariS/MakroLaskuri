# MakroLaskuri

🔗 Live Demo: https://sajaris.github.io/MakroLaskuri/

MakroLaskuri on kevyt selainpohjainen sovellus päivittäisten ravintoarvojen suunnitteluun ja seuraamiseen.  
Sovellus mahdollistaa aterioiden ja juomien lisäämisen muistilistaan sekä niiden kokoamisen päivän kokonaisuudeksi drag & drop -toiminnolla.

Sovellus toimii täysin selaimessa eikä vaadi palvelinta.

## Feature

- Lisää aterioita ja juomia ravintoarvoineen
- Tallenna usein käytetyt rivit muistilistaan
- Raahaa (drag & drop) ateriat päivän listaan
- Näe päivän ravintoarvot automaattisesti laskettuna
- Aseta tavoiterajat ravintoarvoille
- Järjestä päivän ateriat valitun ravintoarvon mukaan
- Monikielinen käyttöliittymä (FI / EN / SV)

## Data storage

Sovellus käyttää selaimen **LocalStoragea**, joten kaikki data tallentuu paikallisesti käyttäjän laitteelle.  
Data ei siirry palvelimelle eikä vaadi kirjautumista.

## Technologies

- TypeScript
- React
- Vite
- Material UI
- dnd-kit (drag & drop)
- Motion

## Deployment

Sovellus rakennetaan **Vite buildilla** ja julkaistaan **GitHub Pagesiin GitHub Actionsin avulla**.


## Limitations

- Nykyinen MVP ei tue mobiilikäyttöä täysin drag & drop -toiminnon vuoksi
- Data ei synkronoidu useiden laitteiden välillä

## Future ideas

- Export / Import datalle
- Pilvisynkronointi useille laitteille
- Parempi mobiilituki
- Lisää ravintoarvojen analytiikkaa

## License

Open source – projektin lähdekoodi löytyy tästä repositoriosta.
