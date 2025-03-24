import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { TextField, InputAdornment, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../context/SessionContext';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function AppAppBar({ goSearch, setLoading, setPage }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleSearch = () => {
    setPage('home');
    scrollToSection('products');
    setLoading(true);
    goSearch(searchQuery);
  };

  const goPage = (page) => {
    setOpen(false);
    setPage(page);
  };

  const goHome = () => {
    setPage('home');
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          {/* Logo */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }}>
            <Typography color='primary' sx={{ fontWeight: 700, fontSize: 14, cursor: 'pointer' }} onClick={() => goHome()}>
              Ofertarproduto.com.br
            </Typography>
          </Box>

          {/* Barra de pesquisa (desktop) */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', mx: 2 }}>
            <TextField
              id="search"
              hiddenLabel
              size="small"
              variant="outlined"
              color="primary"
              aria-label="O que você quer comprar hoje ?"
              placeholder="O que você quer comprar hoje ?"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Botões de login/signup (desktop) */}
          {!user ? (
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
              <Button color="primary" variant="text" size="small" onClick={() => setPage('login')}>
                Entrar em minha conta
              </Button>
              <Button color="primary" variant="contained" size="small" onClick={() => setPage('register')}>
                Cadastrar
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
              <Button color="primary" variant="text" size="small" onClick={() => setPage('account')}>
                Minha conta
              </Button>
            </Box>
          )}

          {/* Barra de pesquisa (mobile) */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mx: 1 }}>
            <TextField
              id="search-mobile"
              hiddenLabel
              size="small"
              variant="outlined"
              aria-label="O que você quer comprar hoje ?"
              placeholder="O que você quer comprar hoje ?"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 400 }} // Largura máxima da barra de pesquisa
            />
          </Box>

          {/* Botão do menu (mobile) */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Drawer (menu mobile) */}
          <Drawer
            anchor="top"
            open={open}
            onClose={toggleDrawer(false)}
            PaperProps={{
              sx: {
                top: 'var(--template-frame-height, 0px)',
              },
            }}
          >
            <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <IconButton onClick={toggleDrawer(false)}>
                  <CloseRoundedIcon />
                </IconButton>
              </Box>

              <MenuItem>
                <Button color="primary" variant="contained" fullWidth onClick={() => goPage('register')}>
                  Cadastrar grátis
                </Button>
              </MenuItem>
              <MenuItem>
                <Button color="primary" variant="outlined" fullWidth onClick={() => goPage('login')}>
                  Acessar minha conta
                </Button>
              </MenuItem>
            </Box>
          </Drawer>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}