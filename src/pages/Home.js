import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '../components/AppBar';
import Hero from '../components/Hero';
import FAQ from '../components/FAQ';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme } from '../components/theme/theme';
import Products from '../components/Products/Products';
import { Collapse, Fab, Badge, Tooltip } from '@mui/material';
import ProductPage from '../components/Products/ProductView';
import Account from './Account';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Checkout from './checkout/Checkout';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { IconButton } from '@mui/material';
import { Remove as RemoveIcon } from '@mui/icons-material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../context/SessionContext';
import {
  Drawer,
  Box,
  CardHeader,
  Typography,
  CardMedia,
  CardContent,
  CardActions,
  Toolbar,
  MenuItem,
  Button
} from '@mui/material';
import { Card } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

const ItemQuantitySelector = ({ item }) => {
  const { user, setUser } = useAuth();

  // Funções para aumentar e diminuir a quantidade
  const increaseQuantity = () => {
    setUser((prevUser) => {
      const updatedCart = [...prevUser.cart, item]; // Adiciona o item ao carrinho
      return { ...prevUser, cart: updatedCart }; // Retorna o estado atualizado
    });
  };

  console.log(user?.cart);

  const decreaseQuantity = () => {
    setUser((prevUser) => {
      // Encontra o índice do último item com o mesmo id no carrinho
      const itemIndex = prevUser.cart.reverse().findIndex((cartItem) => cartItem.id === item.id);
      if (itemIndex !== -1) {
        // Remove o item encontrado
        const updatedCart = [
          ...prevUser.cart.slice(0, prevUser.cart.length - itemIndex - 1),
          ...prevUser.cart.slice(prevUser.cart.length - itemIndex) // A parte que vem depois do item encontrado
        ];
        return { ...prevUser, cart: updatedCart };
      }
      return prevUser;
    });
  };

  return (
    <Box display="flex" alignItems="center">
      {/* Botão de diminuir a quantidade */}
      <IconButton onClick={decreaseQuantity} color="primary">
        <RemoveIcon />
      </IconButton>

      {/* Exibe a quantidade */}
      <Typography variant="h6" component="span" mx={2}>
        {item?.qtd}
      </Typography>

      {/* Botão de aumentar a quantidade */}
      <IconButton onClick={increaseQuantity} color="primary">
        <AddIcon />
      </IconButton>
    </Box>
  );
};

function BottomCart({ open, setOpen, setSelected, setPage, page }) {
  const { user } = useAuth();


  const toggleMenu = () => {
    setOpen(!open);
  };

  function formatCurrencyToMercadoPago(value) {
    if (!value) return null; // Verifica se o valor é nulo ou indefinido

    // Converte o valor para string (caso já seja um número)
    const stringValue = value.toString();

    // Remove caracteres não numéricos, exceto vírgulas e pontos
    const cleanedValue = stringValue.replace(/[^0-9,.]/g, '');

    // Remove os pontos (separadores de milhares) e substitui a vírgula por ponto
    const formattedValue = cleanedValue
      .replace(/\./g, '') // Remove os pontos
      .replace(',', '.'); // Substitui a vírgula por ponto

    // Converte para número
    const numericValue = parseFloat(formattedValue);

    // Verifica se o valor é um número válido
    if (isNaN(numericValue)) {
      console.error('Valor monetário inválido:', value);
      return null;
    }

    // Garante que o valor tenha duas casas decimais
    const fixedValue = numericValue.toFixed(2);

    return parseFloat(fixedValue); // Retorna como número
  }

  // Função para calcular o total
  const calcularTotalCarrinho = () => {
    if (!user?.cart || user.cart.length === 0) return 0;

    // Passo 1: Calcular o total considerando a quantidade de cada item no carrinho
    let total = 0;

    // Passo 2: Iterar sobre o carrinho para somar o valor de cada item com a sua quantidade
    user.cart.forEach((item) => {
      total += formatCurrencyToMercadoPago(item.price);
    });

    return total;
  };



  const totalCarrinho = () => {
    // Função para formatar o valor
    return calcularTotalCarrinho().toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const carrinhoAgrupado = () => {
    if (!user?.cart || user.cart.length === 0) return [];

    return user?.cart?.reduce((acc, obj) => {
      const found = acc.find(item => item.id === obj.id);
      if (found) {
        found.qtd += 1;
      } else {
        acc.push({ ...obj, qtd: 1 });
      }
      return acc;
    }, []);
  };

  const goCheckout = () => {
    setSelected(null);
    setPage('checkout');
    setOpen(false);
  };

  return (
    <div>
      <Drawer
        anchor="bottom"
        open={open}
        onClose={toggleMenu}
        PaperProps={{
          sx: {
            height: '80vh', // Altura do menu
            borderTopLeftRadius: 16, // Borda arredondada
            borderTopRightRadius: 16,
            padding: 4,
            overflowY: 'auto',
            gap: 3,
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
          <Typography>{user?.cart?.length} itens selecionados</Typography>
          <Typography sx={{ ml: 'auto' }}>Total no carrinho: <b>{totalCarrinho()}</b></Typography>
          <Button sx={{ ml: 'auto' }} color="primary" variant='contained' disabled={!user?.cart?.length} onClick={() => goCheckout()}>Ir para pagamento</Button>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'center'
          }}
        >
          {carrinhoAgrupado()?.map((i, index) => (
            <Card sx={{ maxWidth: 250 }} key={index}>
              <CardHeader
                title={<Typography>{i?.title}</Typography>}
              />
              <CardMedia
                component="img"
                height="194"
                image={i?.image}
                alt="Product"
              />
              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {i?.price}
                </Typography>
              </CardContent>
              <CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'center' }}>
                <ItemQuantitySelector item={i} />
              </CardActions>
            </Card>
          ))}
          {!user?.cart?.length && (<>
            Nenhum produto adicionado ao carrinho ainda.
          </>)}
        </Box>
      </Drawer>
    </div>
  );
}

export default function MarketingPage(props) {
  const { user } = useAuth();
  const [searchok, setsearchok] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = React.useState(null);
  const [page, setPage] = React.useState('home');
  const [openCart, setOpenCart] = React.useState(false);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  React.useEffect(() => {
    if (searchok && selected) {
      setSelected(null);
      scrollToSection('products');
    }
  }, [searchok]);

  return (
    <ThemeProvider theme={lightTheme}>
      <BottomCart open={openCart} setOpen={setOpenCart} setSelected={setSelected} setPage={setPage} page={page} />
      <Tooltip title={"Carrinho de compras"}>
        <Badge
          badgeContent={user?.cart?.length}
          color="error"
          overlap="circular"
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ position: 'fixed', bottom: 40, right: 20, zIndex: 2 }}
        >
          <Fab color="warning" aria-label="cart" sx={{ zIndex: 1 }} onClick={() => setOpenCart(true)}>
            <ShoppingCartIcon />
          </Fab>
        </Badge>
      </Tooltip>
      <CssBaseline enableColorScheme />
      <AppBar goSearch={setsearchok} setLoading={setLoading} setPage={setPage} />
      <Collapse in={page === 'login'}>
        <SignIn setPage={setPage} />
      </Collapse>
      <Collapse in={page === 'account'}>
        <Account setPage={setPage} />
      </Collapse>
      <Collapse in={page === 'register'}>
        <SignUp setPage={setPage} />
      </Collapse>
      <Collapse in={!selected && page === 'home'}>
        <Hero goSearch={setsearchok} setLoading={setLoading} />
      </Collapse>
      <div>
        <Collapse in={!selected && page === 'home'}>
          <Products
            goSearch={searchok}
            emitGoSearch={setsearchok}
            loading={loading}
            setLoading={setLoading}
            selected={selected}
            setSelected={setSelected}
            setPage={setPage}
          />
          <FAQ />
        </Collapse>
        {page === 'home' && (
          <Collapse in={selected && page === 'home'}>
            <ProductPage product={selected} setSelected={setSelected} setPage={setPage} />
          </Collapse>
        )}

        <Collapse in={page === 'checkout'}>
          <Checkout product={selected} setSelected={setSelected} setPage={setPage} page={page} />
        </Collapse>
      </div>
    </ThemeProvider>
  );
}