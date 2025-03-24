import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function FAQ() {
  const [expanded, setExpanded] = React.useState([]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(
      isExpanded ? [...expanded, panel] : expanded.filter((item) => item !== panel),
    );
  };

  return (
    <Container
      id="faq"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Typography
        component="h2"
        variant="h4"
        sx={{
          color: 'text.primary',
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
        }}
      >
        Perguntas frequentes
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Accordion
          expanded={expanded.includes('panel1')}
          onChange={handleChange('panel1')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1d-content"
            id="panel1d-header"
          >
            <Typography component="span" variant="subtitle2">
              Como entro em contato com o suporte ao cliente se tiver alguma dúvida ou problema?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: '100%', md: '70%' } }}
            >
              Nossos sistemas utilizam inteligência artificial que monitora 24 horas por dia qualquer erro ou inconsistência, corrigindo a maioria dos problemas automaticamente. No entanto, se você ainda precisar de ajuda ou tiver alguma dúvida, nossa equipe de suporte está disponível para auxiliar.
              Você pode entrar em contato através do e-mail:&nbsp;<Link href="mailto:support@email.com">suporte@ofertarproduto.com.br</Link>&nbsp;
              Responderemos o mais rápido possível para garantir a melhor experiência possível! 😊
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.includes('panel2')}
          onChange={handleChange('panel2')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2d-content"
            id="panel2d-header"
          >
            <Typography component="span" variant="subtitle2">
              Posso devolver o produto se ele não atender às minhas expectativas?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: '100%', md: '70%' } }}
            >
              Absolutamente! Oferecemos uma política de devolução sem complicações. Se você não estiver
              completamente satisfeito, você pode devolver o produto dentro de 15 dias para um reembolso total ou troca.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.includes('panel3')}
          onChange={handleChange('panel3')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3d-content"
            id="panel3d-header"
          >
            <Typography component="span" variant="subtitle2">
              O que faz nosso produto se destacar dos demais no mercado?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: '100%', md: '70%' } }}
            >
              Nosso produto se distingue por sua adaptabilidade, durabilidade,
              e recursos inovadores. Priorizamos a satisfação do usuário e
              nos esforçamos continuamente para exceder as expectativas em todos os aspectos.
              Além claro de todo nosso estoque estar em promoção de inauguração.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.includes('panel4')}
          onChange={handleChange('panel4')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4d-content"
            id="panel4d-header"
          >
            <Typography component="span" variant="subtitle2">
              Por que a loja está em promoção e o frete é grátis ?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: '100%', md: '70%' } }}
            >
              Estamos em promoção especial de inauguração! 🎉 <br/>
              Para celebrar nossa abertura, oferecemos descontos exclusivos e frete grátis em todos os pedidos por tempo limitado. É nossa forma de agradecer pela sua confiança e deixar sua experiência ainda mais especial.

              Aproveite agora antes que acabe! ⏳😊
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
}