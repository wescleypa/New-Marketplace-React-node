import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';
import { useAuth } from '../context/SessionContext';
import { IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

export default function Account({ setPage }) {
  const { user } = useAuth();

  return (
    <Container sx={{ mt: 14 }}>
      <IconButton sx={{ ml: 4, mt: 2 }} onClick={() => setPage('home')}>
        <ArrowBack />&nbsp; Voltar
      </IconButton>
      {user && (<Typography variant="h6" sx={{ textAlign: 'center', mb: 4 }}>Olá {user?.name}</Typography>)}
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">Minhas compras</Typography>
        </AccordionSummary>
        <AccordionDetails>
          Você não tem compras disponíveis ainda ou estão sendo processadas.
        </AccordionDetails>
      </Accordion>
    </Container>
  );
}
