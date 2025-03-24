// src/pages/Home/Products.js
import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Skeleton, Pagination } from '@mui/material';
import ProductCard from './ProductCard';
import { useSocket } from '../../context/SocketContext';

function Products({ goSearch, emitGoSearch, loading, setLoading, selected, setSelected, setPage }) {
  const [title, setTitle] = useState('Produtos mais vendidos');
  const [search, setSearch] = useState();
  const [products, setProducts] = useState([]);
  const [paging, setPaging] = useState(0);
  const socket = useSocket();

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (goSearch) {
      setSearch(goSearch);
      setTitle(`Lista de ${goSearch} com base em sua pesquisa.`);
      socket.emit('search', goSearch, (response) => {
        console.log('Resposta do servidor:', response);
        if (response && response.data) {
          setPaging(response?.data?.totalPages);
          setProducts(response?.data?.data?.map((produto) => {
            // Converte o preço para número (já está no formato 6.099)
            const precoOriginal = Number(produto.price.toString().replace('.', ''));

            // Aplica os descontos
            var precoComDesconto = 0, desconto = 0;
            if (precoOriginal >= 10000) {
              precoComDesconto = (precoOriginal * 0.5).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
              desconto = 50;
            } else
              if (precoOriginal >= 5000 && precoOriginal < 10000) {
                precoComDesconto = (precoOriginal * 0.65).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                });
                desconto = 35;
              } else
                if (precoOriginal >= 2000 && precoOriginal < 5000) {
                  precoComDesconto = (precoOriginal * 0.80).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  });
                  desconto = 20;
                } else
                  if (precoOriginal >= 1000 && precoOriginal < 2000) {
                    precoComDesconto = (precoOriginal * 0.85).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    });
                    desconto = 15;
                  } else precoComDesconto = precoOriginal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  });

            // Retorna o produto com o preço ajustado
            return {
              ...produto,
              price: precoComDesconto,
              discount: desconto,
              originalPrice: precoOriginal.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            };
          }));
        } else {
          setPaging(0);
          setProducts([]); // Caso não haja dados, define como array vazio
        }
        setLoading(false); // Desativa o loading após receber os dados
      });
      emitGoSearch(false);
    }
  }, [goSearch, socket]);

  useEffect(() => {
    const destaques = ['Macbook'];

    if (socket) {
      setLoading(true); // Ativa o loading enquanto os produtos são buscados

      destaques.forEach((produto) => {
        setSearch('Macbook');
        socket.emit('search', produto, (response) => {
          console.log('Resposta do servidor:', response);
          if (response && response.data) {
            setPaging(response?.data?.totalPages);
            setProducts(response?.data?.data?.map((produto) => {
              // Converte o preço para número (já está no formato 6.099)
              const precoOriginal = Number(produto.price.toString().replace('.', ''));

              // Aplica os descontos
              var precoComDesconto = 0, desconto = 0;
              if (precoOriginal >= 10000) {
                precoComDesconto = (precoOriginal * 0.5).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                });
                desconto = 50;
              } else
                if (precoOriginal >= 5000 && precoOriginal < 10000) {
                  precoComDesconto = (precoOriginal * 0.65).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  });
                  desconto = 35;
                } else
                  if (precoOriginal >= 2000 && precoOriginal < 5000) {
                    precoComDesconto = (precoOriginal * 0.80).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    });
                    desconto = 20;
                  } else
                    if (precoOriginal >= 1000 && precoOriginal < 2000) {
                      precoComDesconto = (precoOriginal * 0.85).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      });
                      desconto = 15;
                    } else precoComDesconto = precoOriginal.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    });

              // Retorna o produto com o preço ajustado
              return {
                ...produto,
                price: precoComDesconto,
                discount: desconto,
                originalPrice: precoOriginal.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              };
            }));
          } else {
            setProducts([]); // Caso não haja dados, define como array vazio
            setPaging(0);
          }
          setLoading(false); // Desativa o loading após receber os dados
        });
      });

      // Limpeza ao desmontar o componente
      return () => {
        socket.off('search');
      };
    }
  }, [socket]);

  const changePage = (val) => {
    setLoading(true);
    scrollToSection('products');
    
    socket.emit('search_by_page', { search, val }, (response) => {
      console.log('paging ', response);

      if (response && response.data) {
        setPaging(response?.data?.totalPages);
        setProducts(response?.data?.data?.map((produto) => {
          // Converte o preço para número (já está no formato 6.099)
          const precoOriginal = Number(produto.price.toString().replace('.', ''));

          // Aplica os descontos
          var precoComDesconto = 0, desconto = 0;
          if (precoOriginal >= 10000) {
            precoComDesconto = (precoOriginal * 0.5).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            desconto = 50;
          } else
            if (precoOriginal >= 5000 && precoOriginal < 10000) {
              precoComDesconto = (precoOriginal * 0.65).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
              desconto = 35;
            } else
              if (precoOriginal >= 2000 && precoOriginal < 5000) {
                precoComDesconto = (precoOriginal * 0.80).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                });
                desconto = 20;
              } else
                if (precoOriginal >= 1000 && precoOriginal < 2000) {
                  precoComDesconto = (precoOriginal * 0.85).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  });
                  desconto = 15;
                } else precoComDesconto = precoOriginal.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                });

          // Retorna o produto com o preço ajustado
          return {
            ...produto,
            price: precoComDesconto,
            discount: desconto,
            originalPrice: precoOriginal.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          };
        }));
      } else {
        setProducts([]); // Caso não haja dados, define como array vazio
        setPaging(0);
      }
      setLoading(false); // Desativa o loading após receber os dados
    });
  };

  return (
    <Container sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }} id="products">
      <Typography
        component="h2"
        variant="h5"
        sx={{
          color: 'text.primary',
          textAlign: { sm: 'center', md: 'center' },
          mb: 4,
        }}
      >
        {title}
      </Typography>
      <Grid container spacing={3}>
        {loading ? (
          // Exibe skeletons enquanto os produtos estão sendo carregados
          Array.from({ length: 6 }).map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="80%" />
            </Grid>
          ))
        ) : products.length > 0 ? (
          // Exibe os produtos quando carregados
          products.map((product, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <ProductCard product={product} setSelected={setSelected} setLoading={setLoading} setPage={setPage} />
            </Grid>
          ))
        ) : (
          // Mensagem caso não haja produtos
          <Typography variant="body1" sx={{ textAlign: 'center', width: '100%' }}>
            Nenhum produto encontrado.
          </Typography>
        )}
      </Grid>
      {!!paging && Number(paging) > 0 && (
        <Pagination count={paging} color="primary" onChange={(e) => changePage(e?.target?.innerText)} sx={{ mt: 4 }} />
      )}
    </Container>
  );
}

export default Products;