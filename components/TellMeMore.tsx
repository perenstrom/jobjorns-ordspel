import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Link from 'next/link';
import { Tile } from './Tile';
import { Stack } from '@mui/system';
import { allLettersData } from 'data/defaults';

export const TellMeMore: React.FC<{}> = () => {
  return (
    <Container maxWidth="sm" sx={{ flexGrow: 1 }}>
      <Typography sx={{ marginY: 1 }} variant="h4">
        Om Ordbjörn
      </Typography>
      <Typography sx={{ marginY: 1 }} variant="body1">
        Ordbjörn är ett korsordsspel i samma tradition som{' '}
        <Link href="https://sv.wikipedia.org/wiki/Alfapet">Alfapet</Link> och{' '}
        <Link href="https://sv.wikipedia.org/wiki/Scrabble">Scrabble</Link>. Det
        som skiljer Ordbjörn från de mer traditionella varianterna är att alla
        spelare spelar samtidigt, med identiska brickor. När alla spelare har
        lagt sparas endast det bästa draget på brädet, och turen går vidare.
        Spelet har skapats av{' '}
        <Link href="https://jobjorn.se">Jobjörn Folkesson</Link> som ett
        hobbyprojekt.
      </Typography>

      <Typography sx={{ marginTop: 2, marginBottom: 1 }} variant="h5">
        Spelets flöde
      </Typography>
      <ol>
        <li>Du spelar ett ord. Du har likadana brickor som dina medspelare.</li>
        <li>Samtidigt spelar dina medspelare varsitt ord.</li>
        <li>
          När alla gjort sina drag avgörs vilket drag som vann. Alla får poäng,
          men endast det vinnande draget placeras på brädet inför nästa tur.
        </li>
        <li>
          Brickorna från det vinnande draget dras bort från brickstället, alla
          får nya (likadana) brickor.
        </li>
        <li>
          Spelet tar slut när alla spelare passar eller då brickorna (104 st)
          tar slut.
        </li>
      </ol>

      <Typography sx={{ marginTop: 2, marginBottom: 1 }} variant="h5">
        Poängräkning
      </Typography>

      <Typography sx={{ marginY: 1 }} variant="body1">
        För varje drag får du poäng för de bokstäver som är med i orden som
        bildas i ditt ord (även om brickorna låg där sedan innan).
      </Typography>
      <Typography sx={{ marginY: 1 }} variant="body1">
        Du får dessutom extra poäng baserat på hur många brickor du spelar.
      </Typography>
      <ul>
        <li>1 bricka: 0 extra poäng</li>
        <li>2 brickor: 1 extra poäng</li>
        <li>3 brickor: 1 extra poäng (totalt 2 extra poäng)</li>
        <li>4 brickor: 2 extra poäng (totalt 4 extra poäng)</li>
        <li>5 brickor: 3 extra poäng (totalt 7 extra poäng)</li>
        <li>6 brickor: 5 extra poäng (totalt 12 extra poäng)</li>
        <li>7 brickor: 8 extra poäng (totalt 20 extra poäng)</li>
        <li>8 brickor: 13 extra poäng (totalt 33 extra poäng)</li>
      </ul>
      <Typography sx={{ marginY: 1 }} variant="body1">
        Du får poäng även om ditt ord inte blev det vinnande ordet.
      </Typography>
      <Typography sx={{ marginTop: 2, marginBottom: 1 }} variant="h5">
        Brickornas färger
      </Typography>
      <Stack direction="column" spacing={1}>
        <Stack direction="row" spacing={1}>
          <Box sx={{ width: '3em' }}>
            <Tile
              tile={{ letter: 'O', placed: 'hand' }}
              status="hand"
              onClick={() => {}}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            Brickorna som du har att spela med
          </Box>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Box sx={{ width: '3em' }}>
            <Tile
              tile={{ letter: 'R', placed: 'selected' }}
              status="selected"
              onClick={() => {}}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            Brickan du har markerad, alltså valt att lägga/flytta
          </Box>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Box sx={{ width: '3em' }}>
            <Tile
              tile={{ letter: 'D', placed: 'submitted' }}
              status="submitted"
              onClick={() => {}}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            Brickorna du spelat i den pågående turen
          </Box>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Box sx={{ width: '3em' }}>
            <Tile
              tile={{ letter: 'B', placed: 'board' }}
              status="board"
              onClick={() => {}}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            Brickorna som ligger på brädet från tidigare turer
          </Box>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Box sx={{ width: '3em' }}>
            <Tile
              tile={{ letter: 'J', placed: 'latest' }}
              status="latest"
              onClick={() => {}}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            Brickorna som vann den föregående turen
          </Box>
        </Stack>
      </Stack>

      <Typography sx={{ marginTop: 2, marginBottom: 1 }} variant="h5">
        Antal brickor per bokstav
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {allLettersData.map((letterData) => (
          <Box key={letterData.letter} sx={{ width: '3em', marginRight: 1 }}>
            <Tile
              tile={{ letter: letterData.letter, placed: 'board' }}
              status="board"
              onClick={() => {}}
            />
            <Typography variant="body2" align="center">
              {letterData.count}
            </Typography>
          </Box>
        ))}
      </Box>

      <Typography sx={{ marginTop: 2, marginBottom: 1 }} variant="h5">
        Ordlista
      </Typography>

      <Typography sx={{ marginY: 1 }} variant="body1">
        Tillåtna ord att lägga är oböjda ord i{' '}
        <Link href="https://svenska.se/">Svenska Akademiens Ordlista</Link>.{' '}
        Följande ord på två bokstäver är godkända:
      </Typography>
      <ul>
        <li>ag, ah, aj, al, an, ar, as, av, ax</li>
        <li>BB, be, bh, bi, bo, bu, by, bä</li>
        <li>cd, cp, cv</li>
        <li>di, dj, do, DS, du, dy, då, dö</li>
        <li>ed, eh, ej, ek, el, EM, en, ep, EQ, er, et, EU, ex</li>
        <li>fa, fe, FN, fy, få, fä</li>
        <li>ge, go, gå</li>
        <li>ha, hi, hm, ho, hu, hy, hå, hö</li>
        <li>id, il, in, IQ, is, it</li>
        <li>ja, je, jo, ju</li>
        <li>KK, ko, kö</li>
        <li>la, le, lo, lp, ly, lä</li>
        <li>mc, mi, mo, ms, mu, må, mö</li>
        <li>nu, ny, nå, nä</li>
        <li>oh, oj, ok, om, or, os</li>
        <li>pc, pH, pi, pm, pr, PS, på</li>
        <li>re, ro, rå, rö</li>
        <li>se, si, SM, so, sy, så</li>
        <li>ta, te, ti, TT, tu, tv, ty, tå, tö</li>
        <li>UD, uh, uj, ur, ut, uv</li>
        <li>va, vd, ve, vi, VM, vy</li>
        <li>wc</li>
        <li>yl, yr</li>
        <li>åh, åk, ål, åm, ås, åt</li>
        <li>äh, än</li>
        <li>öd, öh, ök, öl, öm, ör, ös</li>
      </ul>

      <Typography sx={{ marginTop: 2, marginBottom: 1 }} variant="h5">
        Tack
      </Typography>

      <Typography sx={{ marginY: 1 }} variant="body1">
        Det hade inte varit möjligt att bygga Ordbjörn utan råd och stöd från{' '}
        <Link href="https://www.perenstrom.com/">Per Enström</Link>, som
        faktiskt kan något om webbutveckling. Tack även till mina betatestare
        och förslagsgivare Hedvig, Camilla, med flera. Tack också till Svenska
        Akademien som tillhandahållit ordlistan.
      </Typography>
    </Container>
  );
};
