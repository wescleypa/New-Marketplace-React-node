import React, { useState } from 'react';
import { Container, Typography, Button, Grid, Card, CardContent, Rating, Chip, Dialog, IconButton, Skeleton, Badge, Box, Icon } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { Close as CloseIcon } from '@mui/icons-material';
import { FormControlLabel, Checkbox } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const ProductPage = ({ product, setSelected, setPage }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  console.log('sel ', product);
  return (
    <Container id="product" sx={{ mt: 12 }}>
      <IconButton onClick={() => setSelected(null)}>
        <ArrowBack />&nbsp; Voltar
      </IconButton>
      <Grid container spacing={4} sx={{ p: { xs: 2, md: 4 } }}>
        <Grid item xs={12} md={6}>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={50}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            loop={false}
            style={{ backgroundColor: 'white', height: 400 }}
          >
            {!product ? (
              <SwiperSlide>
                <Skeleton variant="rectangular" width="100%" height={400} />
              </SwiperSlide>
            ) : (
              product.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <Chip sx={{ ml: 4, position: 'absolute', right: 10, top: 10 }} label={product?.condicao && product?.condicao === 'new' ? 'Produto novo' : 'Produto novo'} color="primary" />
                  <img src={image} onClick={() => setSelectedImage(image)} alt={`Imagem ${index + 1}`} style={{ cursor: 'pointer', width: '100%', height: '100%', objectFit: 'contain', borderRadius: 10 }} />
                </SwiperSlide>
              ))
            )}
          </Swiper>
        </Grid>
        <Grid item xs={12} md={6}>
          {!product ? (
            <>
              <Skeleton variant="text" width="80%" height={40} />
              <Skeleton variant="text" width="60%" height={30} />
            </>
          ) : (
            <>
              <Typography variant="h5" gutterBottom>
                {product.title}
              </Typography>
              <Typography variant="h5" gutterBottom style={{ position: 'relative' }}>
                <small style={{ fontSize: 12 }}>
                  De <s>R$ {product?.originalPrice}</s>
                </small>
                <small style={{ fontSize: 16 }}>
                  &nbsp;por&nbsp;
                </small>
                R$ {product.price}
                <Chip sx={{ ml: 4 }} label="Promoção" color="success" />
              </Typography>
            </>
          )}

          {!product ? (
            <Skeleton variant="rectangular" width="100%" height={100} sx={{ mt: 2 }} />
          ) : (
            <Box sx={{ display: 'flex' }}>
              {product?.colors?.length > 0 && (
                <Grid container sx={{ display: 'flex', flexDirection: 'column', mt: 4 }}>
                  Cores disponíveis
                  {product.colors.map((cor, index) => (
                    <FormControlLabel
                      key={index}
                      control={<Checkbox defaultChecked={product?.colors?.length <= 1} />}
                      label={cor|| 'Cor indisponível'} // Acessa o nome da cor
                    />
                  ))}
                </Grid>
              )}
              {product?.memory?.length > 0 && (
                <Grid container sx={{ display: 'flex', flexDirection: 'column', mt: 4 }}>
                  Variações
                  {product.memory.map((cor, index) => (
                    <FormControlLabel
                      key={index}
                      control={<Checkbox defaultChecked={product?.memory?.length <= 1} />}
                      label={cor|| 'Cor indisponível'} // Acessa o nome da cor
                    />
                  ))}
                </Grid>
              )}
            </Box>
          )}

          {!product ? (
            <Skeleton variant="text" width="30%" height={30} sx={{ mt: 2 }} />
          ) : (
            <Chip label="Frete grátis" color="primary" />
          )}

          <Grid container gap={2} sx={{ mt: 6 }}>
            {!product ? (
              <>
                <Skeleton variant="rectangular" width={120} height={40} />
                <Skeleton variant="rectangular" width={180} height={40} />
              </>
            ) : (
              <>
                <Button variant="contained" color="primary" size="large" onClick={() => setPage('checkout')}>
                  Comprar
                </Button>
                {/*<Badge badgeContent={0} color="success">
                  <Button variant="outlined" color="success" size="large">
                    Adicionar ao carrinho
                  </Button>
                </Badge>*/}
              </>
            )}
          </Grid>
        </Grid>
      </Grid>

      <Typography variant="body1" paragraph>
        Descrição
      </Typography>
      {!product ? (
        <Skeleton variant="rectangular" width="100%" height={100} />
      ) : (
        <Typography variant="body2" color="primary.main" paragraph>
          {Array.isArray(product?.description) && product?.description?.length > 0 ? (
            product.description.map((item, index) => (
              <Typography key={index}>{item}</Typography>
            ))
          ) : typeof product?.description === 'string' ? (
            <Typography>{product.description}</Typography>
          ) : (
            'Sem descrição'
          )}
        </Typography>
      )}

      <Grid mt={4}>
        <Grid container>
          <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            {!product ? (
              <>
                <Skeleton variant="text" width="60%" height={30} />
                <Skeleton variant="text" width="40%" height={50} />
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="rectangular" width="100%" height={100} sx={{ mt: 2 }} />
              </>
            ) : (
              <>
                <Typography variant="h6" sx={{ textAlign: 'center' }} gutterBottom>
                  Avaliações
                </Typography>
                <Typography variant="h3" sx={{ color: 'primary.main', textAlign: 'center' }}>
                  {product?.aval}
                </Typography>
                <Rating
                  name="read-only"
                  value={product?.aval}
                  readOnly
                />
                <Typography variant="h6" sx={{ color: 'primary.main', textAlign: 'center', mt: 3 }}>
                  {product?.avals}
                </Typography>
                {Number(product?.aval) > 4 && (
                  <Chip sx={{ mt: 3, mb: 6 }} label="Compra muito segura" color="success" />
                )}
                {Number(product?.aval) > 1 && Number(product?.aval) <= 4 && (
                  <Chip sx={{ mt: 3, mb: 6 }} label="Compra não confiavel" color="error" />
                )}
                <img style={{ width: 180 }} src="https://blog.mundolipedema.com.br/wp-content/uploads/2022/06/certificado2-1024x1024.png" />
              </>
            )}
          </Grid>
          <Grid item xs={12} md={9}>
            {!product ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Skeleton variant="text" width="60%" height={30} />
                    <Skeleton variant="rectangular" width="100%" height={100} sx={{ mt: 2 }} />
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <Typography variant="h6" sx={{ textAlign: 'center' }} gutterBottom>
                  Opiniões em destaque
                </Typography>
                {product.reviews?.length <= 0 ? (
                  <Box component="div" sx={{ textAlign: 'center', mt: 6 }}>Sem avaliação</Box>
                ) : (
                  product.reviews.map((review, index) => (
                    <Card key={review.id || index} sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6">{review.user}</Typography>
                        <Grid container>
                          <Grid item xs={10}>
                            <Rating value={Number(review.stars ?? 0)} readOnly />
                          </Grid>
                          <Grid item>
                            <span>{review?.date}</span>
                          </Grid>
                        </Grid>
                        <div style={{ display: 'flex', gap: 2 }}>
                          {review?.photos?.map((p, photoIndex) => (
                            <React.Fragment key={photoIndex}>
                              <br />
                              <img src={p} width={60} height={60} style={{ objectFit: 'cover', cursor: 'pointer' }} onClick={() => setSelectedImage(p)} />
                            </React.Fragment>
                          ))}
                        </div><br />
                        <Typography variant="body2">{review.comment}</Typography>
                        <Typography sx={{fontSize: 10, mt: 2}}>Você não pode curtir este comentário porque sua conta tem menos de 3 meses.</Typography>
                      </CardContent>
                    </Card>
                  ))
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Grid>

      <Dialog open={!!selectedImage} onClose={() => setSelectedImage(null)} maxWidth="md">
        <IconButton
          edge="end"
          color="inherit"
          onClick={() => setSelectedImage(null)}
          aria-label="close"
          sx={{ position: 'fixed', right: 370, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <img src={selectedImage} alt="Imagem ampliada" style={{ width: '100%', height: '80vh', objectFit: 'cover' }} />
      </Dialog>
    </Container>
  );
};

export default ProductPage;