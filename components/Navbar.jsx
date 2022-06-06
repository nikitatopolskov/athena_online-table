import {useState} from "react";
import {Button, FormControl, IconButton, InputLabel, MenuItem, Select} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import Fuse from "fuse.js";
import {observer} from "mobx-react-lite";

// components
import cardState from "../store/cardState";
import {BoxNavbar, BoxRight} from "../styles/navbar";
import {getData} from "../firebase";
import {userState} from "../store";

const Navbar = observer(() => {
  const [owner, setOwner] = useState('1');
  const name = userState.username;
  const fuseAuthor = new Fuse(cardState.card, {
    keys: [
      'ownerName',
    ]
  });
  const fuseListener = new Fuse(cardState.card, {
    keys: [
      'username',
    ]
  });
  const resultsAuthor = fuseAuthor.search(name);
  const resultsListener = fuseListener.search(name);

  // change filter property
  const handleChange = (event) => {
    switch (event.target.value) {
      case 1:
        cardState.filterCard = cardState.card;
        break;
      case 2:
        cardState.filterCard = resultsAuthor.map(result => result.item);
        break;
      case 3:
        cardState.filterCard = [];
        resultsListener.forEach(result => {
          if (result.item.username !== result.item.ownerName) {
            cardState.filterCard.push(result.item)
          }
        });
        break;
      default:
        break;
    }

    setOwner(event.target.value);
  };

  return (
    <>
      <BoxNavbar>
        <h3>Недавние файлы</h3>
        <BoxRight>
          <Button variant="contained" onClick={() => getData()}>Вывод Проектов</Button>
          <FormControl sx={{m: 1, minWidth: 120}} size="small">
            <InputLabel id="demo-select-small">Владелец</InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              value={owner}
              label="Владелец"
              autoWidth={true}
              onChange={handleChange}
            >
              <MenuItem value={1}>Кто угодно</MenuItem>
              <MenuItem value={2}>Я</MenuItem>
              <MenuItem value={3}>Не я</MenuItem>
            </Select>
          </FormControl>
          <IconButton color="primary" aria-label="Перезагрузить страницу">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/">
              <RefreshIcon fontSize="medium"/>
            </a>
          </IconButton>
        </BoxRight>
      </BoxNavbar>
    </>
  )
});

export default Navbar;