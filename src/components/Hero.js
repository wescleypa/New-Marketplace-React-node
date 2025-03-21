import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function Hero({ goSearch, setLoading }) {

  const [search, setSearch] = React.useState();

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const emitSearch = () => {
    if (search) {
      setLoading(true);
      goSearch(search);
      scrollToSection('products');
    }
  };

  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
        ...theme.applyStyles('dark', {
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
        }),
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: 4,
        }}
      >
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
        >
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              fontSize: '3rem',
            }}
          >
            Os&nbsp;melhores&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={(theme) => ({
                fontSize: 'inherit',
                color: 'primary.main',
                ...theme.applyStyles('dark', {
                  color: 'primary.light',
                }),
              })}
            >
              produtos
            </Typography>&nbsp;com&nbsp;os&nbsp;melhores&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={(theme) => ({
                fontSize: 'inherit',
                color: 'primary.main',
                ...theme.applyStyles('dark', {
                  color: 'primary.light',
                }),
              })}
            >
              preços
            </Typography>
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              width: { sm: '100%', md: '80%' },
            }}
          >
            Conheça os melhores produtos do mercado com
            os preços mais acessíveis disponíveis
            em promoção de nossa <Typography component='div' sx={{ color: 'primary.main' }}>inauguração.</Typography>
          </Typography>
          <Box sx={{ width: '100%', maxWidth: '600px', pt: 2 }}>
            <Stack direction="row" spacing={1} useFlexGap>
              <TextField
                id="search"
                hiddenLabel
                size="large"
                variant="outlined"
                aria-label="O que você quer comprar hoje ?"
                placeholder="O que você quer comprar hoje ?"
                fullWidth
                sx={{ flexGrow: 1 }}
                onChange={(e) => setSearch(e?.target?.value)}
                value={search}
              />
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ minWidth: 'fit-content', height: 56 }}
                onClick={() => emitSearch(search)}
              >
                Pesquisar produto
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}