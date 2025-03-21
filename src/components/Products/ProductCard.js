import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { Tooltip } from '@mui/material';
import { Rating } from '@mui/material';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/SessionContext';
import {Badge} from '@mui/material';

export default function Products({ product, setSelected, setLoading, setPage }) {
  const { user, setUser } = useAuth();
  const socket = useSocket();

  // Estado para armazenar os favoritos
  const [favorites, setFavorite] = React.useState(() => {
    // Busca os favoritos do localStorage ao inicializar
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const handleShare = async (product) => {
    const shareData = {
      title: product.title, // Título do produto
      text: product.description, // Descrição do produto
      url: window.location.href, // URL da página do produto
    };

    try {
      // Verifica se a API Web Share é suportada
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback para dispositivos que não suportam a API
        alert('Compartilhamento não suportado no seu navegador.');
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      alert('Ocorreu um erro ao compartilhar o produto.');
    }
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const showProduct = (product) => {
    setLoading(true);
    socket.emit('getProduct', product, (response) => {
      if (response && response?.data) {
        scrollToSection('product');
        setSelected(Object.assign({}, product, response?.data));
      }
      setLoading(false);
    });
  };

  const addCart = async (product) => {
    if (user) {
      console.log(user?.cart)
      try {
        setUser((prevUser) => ({
          ...prevUser,
          cart: [...prevUser.cart, product],
        }));

        socket.emit('addToCart', { userId: user.userId, product }, (response) => {
          if (!response?.status || response.status !== 'success') {
            setUser((prevUser) => ({
              ...prevUser,
              cart: prevUser.cart.filter((item) => item.id !== product?.id),
            }));
          }
        });
      } catch (error) {
        console.error('Erro ao adicionar ao carrinho:', error);
        alert('Ocorreu um erro ao adicionar o produto ao carrinho.');
      }
    } else {
      setPage('login');
    }
  };

  const favorite = (id) => {
    setFavorite((prev) => {
      let newFavorites;
      if (prev.includes(id)) {
        // Remove o ID do array
        newFavorites = prev.filter((favId) => favId !== id);
      } else {
        // Adiciona o ID ao array
        newFavorites = [...prev, id];
      }
      // Salva no localStorage
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const getItemQuantity = (productId) => {
    return user?.cart?.reduce((total, item) =>
      item.id === productId ? total + 1 : total, // Soma 1 para cada item com o mesmo ID
      0) || 0; // Retorna 0 se user ou cart for undefined
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'scale(1.003)',
          boxShadow: 2,
          cursor: 'pointer',
        },
      }}
    >
      <CardHeader
        title={<Typography>{product?.title ?? 'Sem título'}</Typography>}
        subheader={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating defaultValue={product?.rating ?? 4} precision={0.5} readOnly /> {product?.reviews} avaliações
            {product?.isOnSale && <Chip label="Promoção" color="secondary" size="small" />}
          </Box>
        }
        onClick={() => showProduct(product)}
      />
      <Box sx={{ position: 'relative' }} onClick={() => showProduct(product)}>
        <CardMedia
          component="img"
          height="194"
          image={product?.image}
          alt={product?.name}
          sx={{ objectFit: 'contain' }}
        />
        {product?.discount && (
          <Chip
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
            color="success"
            label={`${product?.discount}% de desconto`}
          />
        )}
      </Box>
      <CardContent onClick={() => showProduct(product)}>
        <Typography variant="body2" color="text.secondary">
          {product?.description}
        </Typography>
      </CardContent>
      <CardActions
        disableSpacing
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
        }}
      >
        <Typography variant="h6" color="primary" onClick={() => showProduct(product)}>
          {product?.price} <s style={{ fontSize: 13 }}>{product?.originalPrice}</s>
        </Typography>
        <Box>
          <Tooltip title={"Adicionar ao carrinho"}>
            <Badge
              badgeContent={getItemQuantity(product?.id)}
              color="error"
              overlap="circular"
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <IconButton
                aria-label="add to cart"
                onClick={() => addCart(product)}
                color={'inherit'}
              >
                <AddShoppingCartIcon />
              </IconButton>
            </Badge>
          </Tooltip>
          <Tooltip title={favorites.includes(product?.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
            <IconButton
              aria-label="add to favorites"
              onClick={() => favorite(product?.id)}
              color={favorites.includes(product?.id) ? 'error' : 'inherit'}
            >
              <FavoriteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Compartilhar">
            <IconButton aria-label="share" onClick={() => handleShare(product)}>
              <ShareIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
}