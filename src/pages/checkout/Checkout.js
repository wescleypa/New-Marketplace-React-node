import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import SimCardRoundedIcon from '@mui/icons-material/SimCardRounded';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { Container, styled } from '@mui/material';
import MuiCard from '@mui/material/Card';
import PixIcon from '@mui/icons-material/Pix';
import { initMercadoPago, Wallet, getPaymentMethods, getInstallments, CardPayment } from '@mercadopago/sdk-react';
import { createCardToken } from '@mercadopago/sdk-react/esm/coreMethods';
import { TextField, Radio, Select, MenuItem, CardActionArea, CardContent, CircularProgress, Snackbar } from '@mui/material';
import { AttachMoney } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import './boleto.scss';
import { useAuth } from '../../context/SessionContext';
import { InputLabel } from '@mui/material';

// Inicializa o Mercado Pago
initMercadoPago(process.env.REACT_APP_MP_PUBLIC_KEY, { locale: 'pt-BR' });

function EstadoSelector({ setFormData, formData, errors }) {
  // Lista de estados do Brasil
  const estados = [
    { sigla: 'AC', nome: 'Acre' },
    { sigla: 'AL', nome: 'Alagoas' },
    { sigla: 'AP', nome: 'Amapá' },
    { sigla: 'AM', nome: 'Amazonas' },
    { sigla: 'BA', nome: 'Bahia' },
    { sigla: 'CE', nome: 'Ceará' },
    { sigla: 'DF', nome: 'Distrito Federal' },
    { sigla: 'ES', nome: 'Espírito Santo' },
    { sigla: 'GO', nome: 'Goiás' },
    { sigla: 'MA', nome: 'Maranhão' },
    { sigla: 'MT', nome: 'Mato Grosso' },
    { sigla: 'MS', nome: 'Mato Grosso do Sul' },
    { sigla: 'MG', nome: 'Minas Gerais' },
    { sigla: 'PA', nome: 'Pará' },
    { sigla: 'PB', nome: 'Paraíba' },
    { sigla: 'PR', nome: 'Paraná' },
    { sigla: 'PE', nome: 'Pernambuco' },
    { sigla: 'PI', nome: 'Piauí' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' },
    { sigla: 'RN', nome: 'Rio Grande do Norte' },
    { sigla: 'RS', nome: 'Rio Grande do Sul' },
    { sigla: 'RO', nome: 'Rondônia' },
    { sigla: 'RR', nome: 'Roraima' },
    { sigla: 'SC', nome: 'Santa Catarina' },
    { sigla: 'SP', nome: 'São Paulo' },
    { sigla: 'SE', nome: 'Sergipe' },
    { sigla: 'TO', nome: 'Tocantins' },
  ];

  // Função para lidar com a mudança de seleção
  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, state: event.target.value }));
  };

  return (
    <Box sx={{ minWidth: 220 }}>
      <FormControl fullWidth>
        <FormLabel htmlFor="zip" required>
          Estado
        </FormLabel>
        <Select
          labelId="estado-select-label"
          id="estado-select"
          value={formData.state}
          onChange={handleChange}
        >
          {/* Mapeia a lista de estados para criar os MenuItems */}
          {estados.map((estado) => (
            <MenuItem key={estado.sigla} value={estado.sigla}>
              {estado.nome} ({estado.sigla})
            </MenuItem>
          ))}
        </Select>
        {errors.state && <Typography color="error">{errors.state}</Typography>}
      </FormControl>
    </Box>
  );
}

const Card = styled(MuiCard)(({ theme }) => ({
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  width: '100%',
  '&:hover': {
    background:
      'linear-gradient(to bottom right, hsla(210, 100%, 97%, 0.5) 25%, hsla(210, 100%, 90%, 0.3) 100%)',
    borderColor: 'primary.light',
    boxShadow: '0px 2px 8px hsla(0, 0%, 0%, 0.1)',
    ...theme.applyStyles('dark', {
      background:
        'linear-gradient(to right bottom, hsla(210, 100%, 12%, 0.2) 25%, hsla(210, 100%, 16%, 0.2) 100%)',
      borderColor: 'primary.dark',
      boxShadow: '0px 1px 8px hsla(210, 100%, 25%, 0.5) ',
    }),
  },
  [theme.breakpoints.up('md')]: {
    flexGrow: 1,
    maxWidth: `calc(50% - ${theme.spacing(1)})`,
  },
  variants: [
    {
      props: ({ selected }) => selected,
      style: {
        borderColor: (theme.vars || theme).palette.primary.light,
        ...theme.applyStyles('dark', {
          borderColor: (theme.vars || theme).palette.primary.dark,
        }),
      },
    },
  ],
}));

const PaymentContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: '100%',
  height: 375,
  padding: theme.spacing(3),
  borderRadius: `calc(${theme.shape.borderRadius}px + 4px)`,
  border: '1px solid ',
  borderColor: (theme.vars || theme).palette.divider,
  background:
    'linear-gradient(to bottom right, hsla(220, 35%, 97%, 0.3) 25%, hsla(220, 20%, 88%, 0.3) 100%)',
  boxShadow: '0px 4px 8px hsla(210, 0%, 0%, 0.05)',
  [theme.breakpoints.up('xs')]: {
    height: 300,
  },
  [theme.breakpoints.up('sm')]: {
    height: 350,
  },
  ...theme.applyStyles('dark', {
    background:
      'linear-gradient(to right bottom, hsla(220, 30%, 6%, 0.2) 25%, hsla(220, 20%, 25%, 0.2) 100%)',
    boxShadow: '0px 4px 8px hsl(220, 35%, 0%)',
  }),
}));

const FormGrid = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

// Passos do Stepper
const steps = ['Endereço de entrega', 'Confirmação de detalhes', 'Informações de pagamento'];

// Componente AddressForm
function AddressForm({ formData, setFormData, onNext }) {
  const [errors, setErrors] = React.useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'Campo obrigatório';
    if (!formData.lastName) newErrors.lastName = 'Campo obrigatório';
    if (!formData.address1) newErrors.address1 = 'Campo obrigatório';
    if (!formData.city) newErrors.city = 'Campo obrigatório';
    if (!formData.state) newErrors.state = 'Campo obrigatório';
    if (!formData.zip) newErrors.zip = 'Campo obrigatório';
    if (!formData.country) newErrors.country = 'Campo obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  const setCep = (value) => {
    const formatCep = (value) => {
      // Remove todos os caracteres não numéricos
      const numericValue = value.replace(/\D/g, '');

      // Aplica a máscara de CEP (XXXXX-XXX)
      if (numericValue.length <= 5) {
        return numericValue;
      } else {
        return `${numericValue.slice(0, 5)}-${numericValue.slice(5, 8)}`;
      }
    };
    setFormData({ ...formData, zip: formatCep(value) });

    if (value?.length === 9) {
      const fetchAddress = async (cep) => {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const data = await response.json();

          if (!data.erro) {
            setFormData((prev) => ({
              ...prev,
              address2: data?.bairro,
              address1: data?.logradouro,
              state: data?.uf,
              city: data?.localidade
            }));
            // Preenche os campos com os dados retornados
            //setLogradouro(data.logradouro);
            //setBairro(data.bairro);
            //setCidade(data.localidade);
            //setUf(data.uf);
            console.log('cep ', data);
          } else {
            console.error('CEP não encontrado');
          }
        } catch (error) {
          console.error('Erro ao consultar CEP:', error);
        }
      };

      fetchAddress(value?.toString()?.replace('-', ''));
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <FormLabel htmlFor="firstName" required>
          Nome
        </FormLabel>
        <OutlinedInput
          id="firstName"
          name="firstName"
          placeholder="João"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          error={!!errors.firstName}
          fullWidth
        />
        {errors.firstName && <Typography color="error">{errors.firstName}</Typography>}
      </Grid>
      <Grid item xs={12} md={6}>
        <FormLabel htmlFor="lastName" required>
          Sobrenome
        </FormLabel>
        <OutlinedInput
          id="lastName"
          name="lastName"
          placeholder="Silva"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          error={!!errors.lastName}
          fullWidth
        />
        {errors.lastName && <Typography color="error">{errors.lastName}</Typography>}
      </Grid>
      <Grid item xs={12}>
        <FormLabel htmlFor="address1" required>
          Endereço linha 1
        </FormLabel>
        <OutlinedInput
          id="address1"
          name="address1"
          placeholder="Rua e número"
          value={formData.address1}
          onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
          error={!!errors.address1}
          fullWidth
        />
        {errors.address1 && <Typography color="error">{errors.address1}</Typography>}
      </Grid>
      <Grid item xs={12}>
        <FormLabel htmlFor="address2" required>Endereço linha 2</FormLabel>
        <OutlinedInput
          id="address2"
          name="address2"
          placeholder="Número e complemento"
          value={formData.address2}
          onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
          fullWidth
          required
        />
      </Grid>
      <Grid item xs={6}>
        <FormLabel htmlFor="city" required>
          Cidade
        </FormLabel>
        <OutlinedInput
          id="city"
          name="city"
          placeholder="São Paulo"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          error={!!errors.city}
          fullWidth
        />
        {errors.city && <Typography color="error">{errors.city}</Typography>}
      </Grid>
      <Grid item xs={6}>
        <EstadoSelector setFormData={setFormData} formData={formData} errors={errors} />
      </Grid>
      <Grid item xs={6}>
        <FormLabel htmlFor="zip" required>
          CEP
        </FormLabel>
        <OutlinedInput
          id="zip"
          name="zip"
          placeholder="12345-678"
          value={formData.zip}
          onChange={(e) => setCep(e?.target?.value)}
          error={!!errors.zip}
          fullWidth
        />
        {errors.zip && <Typography color="error">{errors.zip}</Typography>}
      </Grid>
      <Grid item xs={6}>
        <FormLabel htmlFor="country" required>
          País
        </FormLabel>
        <OutlinedInput
          id="country"
          name="country"
          placeholder="Brasil"
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          error={!!errors.country}
          fullWidth
        />
        {errors.country && <Typography color="error">{errors.country}</Typography>}
      </Grid>

      <Grid item xs={12}>
        <Button variant="contained" onClick={handleNext} fullWidth>
          Próximo
        </Button>
      </Grid>
    </Grid>
  );
}

// Componente PaymentForm
function PaymentForm({ formData, product, onNext, paymentType, setPaymentType, pay, setPage }) {
  const { user } = useAuth();

  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [cpf, setCPF] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cardName, setCardName] = useState('');
  const [errors, setErrors] = useState({});
  const [issuer, setIssuer] = useState(null);
  const [installments, setInstallments] = useState([]);
  const [selectedInstallments, setSelectedInstallments] = useState('');
  const [bandeira, setBandeira] = useState();
  const [email, setEmail] = useState('');
  const [qrPix, setqrPix] = useState();
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [copySnackbar, setCopySnackbar] = useState(false);
  const [cardToken, setCardToken] = useState(null);
  const [errorPay, setErrorPay] = useState(null);

  const calcularTotalCarrinho = () => {
    if (!user?.cart || user.cart.length === 0) return 0;

    // Passo 1: Somar os preços de todos os itens no carrinho
    const total = user.cart.reduce((acc, item) => {
      return acc + formatCurrencyToMercadoPago(item.price);  // Soma o preço do item
    }, 0);

    // Passo 2: Formatar o total
    return total;
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

  useEffect(() => {
    const start = async () => {
      if (cardNumber.replace(/\s/g, '').length >= 6) {
        const bin = cardNumber.replace(/\s/g, '').substring(0, 6);
        const getParcelas = async () => {

          const params = {
            bin: cardNumber.replace(/\s/g, '').substring(0, 6), // Primeiros 6 dígitos do cartão
            amount: product ? `${formatCurrencyToMercadoPago(product?.price)}` : `${calcularTotalCarrinho()}`,
            payment_type_id: 'credit_card'
          };

          await getInstallments(params)
            .then((res) => {
              console.log('parcelas ', res);
              setInstallments(res[0]?.payer_costs);
            })
            .catch((err) => {
              console.error('erro ao buscar parcelas', err);
            });
        };

        await getPaymentMethods({ bin })
          .then((res) => {
            setBandeira(res?.results[0]?.thumbnail);
            setErrors((prev) => ({ ...prev, cardNumber: null }));
            getParcelas();
          })
          .catch((err) => {
            setBandeira(null);
            setErrors((prev) => ({ ...prev, cardNumber: 'Número do cartão inválido' }));
            console.error(err);
          });
      }
    };
    start();
  }, [cardNumber]);

  const createPayment = async (type = null) => {
    try {
      setqrPix(null);

      if (!email || !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email)) {
        return setErrors((prev) => ({ ...prev, email: 'E-mail é obrigatório e precisa ser válido.' }));
      }

      if (!cpf || !(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).test(cpf)) {
        return setErrors((prev) => ({ ...prev, cpf: 'CPF é obrigatório e precisa ser válido .' }));
      }

      setErrors((prev) => ({ ...prev, email: '' }));
      setErrors((prev) => ({ ...prev, cpf: '' }));

      const paymentData = {
        transaction_amount: product ? formatCurrencyToMercadoPago(product?.price) : calcularTotalCarrinho(),
        payment_method_id: type ?? 'pix',
        description: product ? product?.title : user?.cart?.map(item => item?.title).join(', '),
        payer: {
          email,
          first_name: formData?.firstName,
          last_name: formData?.lastName,
          identification: {
            type: 'cpf',
            number: cpf,
          },
          address: {
            zip_code: formData?.zip?.toString()?.replace('-', ''),
            city: formData?.city,
            neighborhood: formData?.address2,
            street_name: formData?.address1,
            street_number: '25',
            federal_unit: formData?.state,
          },
        }
      };

      setLoadingPayment(true);
      const result = await axios.post(`${process.env.REACT_APP_API_URL}/api/create_payment`, paymentData);

      if (result?.data && result?.data?.point_of_interaction) {
        if (!type || type === "pix") {
          setqrPix(result?.data?.point_of_interaction?.transaction_data);
        } else if (type === 'bolbradesco') {
          setqrPix({ ...result?.data?.transaction_details, vencimento: result?.data?.date_of_expiration });
        }
      }
      setLoadingPayment(false);
    } catch (error) {
      console.error('Erro ao criar cobrança PIX:', error);
      setLoadingPayment(false);
      throw error;
    }
  };

  const handlePaymentTypeChange = (event) => {
    setPaymentType(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event?.target?.value);
  };

  const handleCardNumberChange = (event) => {
    const value = event.target.value.replace(/\D/g, '');
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    if (value.length <= 16) {
      setCardNumber(formattedValue);
    }
  };

  const handleCvvChange = (event) => {
    const value = event.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handleCPFChange = (event) => {
    const value = event.target.value.replace(/\D/g, '');

    const formatCpf = (value) => {
      // Remove todos os caracteres não numéricos
      const numericValue = value.replace(/\D/g, '');

      // Aplica a máscara de CPF (XXX.XXX.XXX-XX)
      if (numericValue.length <= 3) {
        return numericValue;
      } else if (numericValue.length <= 6) {
        return `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}`;
      } else if (numericValue.length <= 9) {
        return `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}.${numericValue.slice(6, 9)}`;
      } else {
        return `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}.${numericValue.slice(6, 9)}-${numericValue.slice(9, 11)}`;
      }
    };

    if (value.length <= 14) {
      setCPF(formatCpf(value));
    }
  };

  const handleExpirationDateChange = (event) => {
    const value = event.target.value.replace(/\D/g, '');
    const formattedValue = value.replace(/(\d{2})(?=\d{2})/, '$1/');
    if (value.length <= 4) {
      setExpirationDate(formattedValue);
    }
  };

  const handleCardNameChange = (event) => {
    setCardName(event.target.value);
  };

  const handleInstallmentsChange = (event) => {
    setSelectedInstallments(event.target.value);
  };

  const validate = () => {
    const newErrors = {};

    if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Número do cartão inválido';
    }

    if (!cvv || cvv.length !== 3) {
      newErrors.cvv = 'CVV inválido';
    }

    if (!expirationDate || !/^\d{2}\/\d{2}$/.test(expirationDate)) {
      newErrors.expirationDate = 'Data de expiração inválida';
    }

    if (!cardName) {
      newErrors.cardName = 'Nome no cartão é obrigatório';
    }

    if (!selectedInstallments) {
      newErrors.installments = 'Selecione o número de parcelas';
    }

    if (!cpf) {
      newErrors.cpf = 'CPF é necessário para prosseguir';
    }

    if (!email) {
      newErrors.email = 'E-mail é necessário para confirmação';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {

    }
  };

  const finishCard = async () => {
    if (validate()) {
      const [mm, yy] = expirationDate?.toString().split('/');
      const params = {
        cardNumber: `${cardNumber.replace(/\s/g, '')}`,
        cardholderName: `${cardName}`,
        cardExpirationMonth: `${mm}`,
        cardExpirationYear: `${yy}`,
        securityCode: `${cvv}`,
        identificationType: 'cpf',
        identificationNumber: `${cpf.replace(/\D/g, '')}`,
      };

      const cardToken = await createCardToken(params);

      if (cardToken) {
        setCardToken(cardToken?.id);

        setLoadingPayment(true);

        const paymentData = {
          transaction_amount: product ? formatCurrencyToMercadoPago(product?.price) : calcularTotalCarrinho(),
          token: cardToken.id,
          description: product ? product?.title : user?.cart?.map(item => item?.title).join(', '),
          installments: selectedInstallments, // Número de parcelas
          //payment_method_id: "visa", // Bandeira do cartão
          payer: {
            email,
            identification: {
              type: "CPF",
              number: cpf
            }
          }
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/api/payment_credit`, paymentData)
          .then(res => {
            setPage('account');
            setErrorPay(null);
          })
          .catch(err => {
            if (err?.response) {
              setErrorPay(err?.response?.data?.error ?? 'Erro interno');
            } else {
              setErrorPay('Falha com erro interno, contate o suporte.');
            }
          });

        setLoadingPayment(false);
      }
    }
  };

  const handleCopy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopySnackbar(true);
    } catch (err) {
      console.error('Erro ao copiar o texto:', err);
    }
  };

  const handleCloseSnack = () => {
    setCopySnackbar(false);
  };

  const formatarVencimento = (data) => {
    const date = new Date(data);
    const formattedDate = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    return formattedDate.replace(/^(\w)/, (match) => match.toUpperCase());
  };

  const formatarValor = (valor) => {
    return valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const bolBradesco = () => {
    setqrPix(null);
    setPaymentType('bolbradesco');
  };

  const goPix = () => {
    setqrPix(null);
    setPaymentType('pix');
  };

  const closeSnack = () => {
    setErrorPay(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Snackbar
        open={errorPay}
        autoHideDuration={6000}
        onClose={closeSnack}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
      >
        <Alert
          onClose={closeSnack}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {errorPay}
        </Alert>
      </Snackbar>

      <Typography variant="h6" textAlign={'center'} gutterBottom>
        Escolha a forma de pagamento
      </Typography>

      <RadioGroup
        aria-label="Payment options"
        name="paymentType"
        value={paymentType}
        onChange={handlePaymentTypeChange}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 3
        }}
      >

        <Card selected={paymentType === 'credit_card'}>
          <CardActionArea
            onClick={() => setPaymentType('credit_card')}
            sx={{
              '.MuiCardActionArea-focusHighlight': {
                backgroundColor: 'transparent',
              },
              '&:focus-visible': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CreditCardRoundedIcon
                fontSize="small"
                sx={[
                  (theme) => ({
                    color: 'grey.400',
                    ...theme.applyStyles('dark', {
                      color: 'grey.600',
                    }),
                  }),
                  paymentType === 'credit_card' && {
                    color: 'primary.main',
                  },
                ]}
              />
              <Typography sx={{ fontWeight: 'medium' }}>Cartão de crédito</Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card selected={paymentType === 'pix'}>
          <CardActionArea
            onClick={() => goPix()}
            sx={{
              '.MuiCardActionArea-focusHighlight': {
                backgroundColor: 'transparent',
              },
              '&:focus-visible': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CreditCardRoundedIcon
                fontSize="small"
                sx={[
                  (theme) => ({
                    color: 'grey.400',
                    ...theme.applyStyles('dark', {
                      color: 'grey.600',
                    }),
                  }),
                  paymentType === 'pix' && {
                    color: 'primary.main',
                  },
                ]}
              />
              <Typography sx={{ fontWeight: 'medium' }}>PIX</Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card selected={paymentType === 'bolbradesco'}>
          <CardActionArea
            onClick={() => bolBradesco()}
            sx={{
              '.MuiCardActionArea-focusHighlight': {
                backgroundColor: 'transparent',
              },
              '&:focus-visible': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CreditCardRoundedIcon
                fontSize="small"
                sx={[
                  (theme) => ({
                    color: 'grey.400',
                    ...theme.applyStyles('dark', {
                      color: 'grey.600',
                    }),
                  }),
                  paymentType === 'bolbradesco' && {
                    color: 'primary.main',
                  },
                ]}
              />
              <Typography sx={{ fontWeight: 'medium' }}>Boleto</Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card selected={paymentType === 'account_money'}>
          <CardActionArea
            onClick={() => setPaymentType('account_money')}
            sx={{
              '.MuiCardActionArea-focusHighlight': {
                backgroundColor: 'transparent',
              },
              '&:focus-visible': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CreditCardRoundedIcon
                fontSize="small"
                sx={[
                  (theme) => ({
                    color: 'grey.400',
                    ...theme.applyStyles('dark', {
                      color: 'grey.600',
                    }),
                  }),
                  paymentType === 'account_money' && {
                    color: 'primary.main',
                  },
                ]}
              />
              <Typography sx={{ fontWeight: 'medium' }}>Saldo Mercadopago</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </RadioGroup>

      {paymentType === 'credit_card' && (<>
        <PaymentContainer>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle2">Cartão de Crédito</Typography>
            <CreditCardRoundedIcon sx={{ color: 'text.secondary' }} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {!bandeira ? (
              <SimCardRoundedIcon
                sx={{
                  fontSize: { xs: 48, sm: 56 },
                  transform: 'rotate(90deg)',
                  color: 'text.secondary',
                }}
              />
            ) : (
              <img src={bandeira} style={{ width: 40 }} />
            )}

            <TextField
              label="Número do Cartão"
              value={cardNumber}
              onChange={handleCardNumberChange}
              error={!!errors.cardNumber}
              helperText={errors.cardNumber}
              fullWidth
              size='small'
              disabled={loadingPayment}
            />

          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <TextField
              label="CVV"
              value={cvv}
              onChange={handleCvvChange}
              error={!!errors.cvv}
              helperText={errors.cvv}
              fullWidth
              size='small'
              disabled={loadingPayment}
            />
            <TextField
              label="MM/AA"
              value={expirationDate}
              onChange={handleExpirationDateChange}
              error={!!errors.expirationDate}
              helperText={errors.expirationDate}
              fullWidth
              size='small'
              disabled={loadingPayment}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <TextField
              label="Nome no Cartão"
              value={cardName}
              onChange={handleCardNameChange}
              error={!!errors.cardName}
              helperText={errors.cardName}
              fullWidth
              size="small"
              disabled={loadingPayment}
            />
            <TextField
              label="CPF"
              value={cpf}
              onChange={handleCPFChange}
              error={!!errors.cpf}
              helperText={errors.cpf}
              fullWidth
              size='small'
              disabled={loadingPayment}
            />
          </Box>

          <TextField
            label="E-mail"
            value={email}
            onChange={handleEmailChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            size="small"
            disabled={loadingPayment}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="parcelas">Parcelas</InputLabel>
              <Select
                labelId="parcelas"
                id="parcelas_s"
                value={selectedInstallments}
                label="Parcelas"
                onChange={handleInstallmentsChange}
                error={!!errors.installments}
                helperText={errors.installments}
                disabled={loadingPayment}
              >
                {installments?.map((i, index) => (
                  <MenuItem key={index} value={i}>{`${i?.installments}x de ${formatarValor(i?.installment_amount)} - (Total: ${formatarValor(i?.total_amount)})`}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button variant="contained" size='small' onClick={() => finishCard()} disabled={loadingPayment}>
              Finalizar pedido
            </Button>
          </Box>
        </PaymentContainer>
      </>)
      }

      {
        paymentType === 'pix' && (<>
          <Snackbar
            open={copySnackbar}
            message="Código PIX copiado, agora é só colar no seu banco."
            anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
            onClose={handleCloseSnack}
            autoHideDuration={6000}
          />
          {!loadingPayment ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {!qrPix ? (<>
                <Alert severity="info">
                  As leis Brasileiras exigem identidade para processar um pagamento.
                </Alert>

                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                  <TextField
                    label="CPF"
                    value={cpf}
                    onChange={handleCPFChange}
                    error={!!errors.cpf}
                    helperText={errors.cpf}
                    fullWidth
                    size='small'
                  />

                  <TextField
                    label="E-mail"
                    value={email}
                    onChange={handleEmailChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    fullWidth
                    size='small'
                  />
                </Box>
              </>) : (
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                  <Typography sx={{ mb: 3 }}>Pague agora o valor de {product ? product?.price : `R$ ${formatarValor(calcularTotalCarrinho())}`} com o código gerado abaixo.</Typography>
                  <img src={`data:image/png;base64,${qrPix?.qr_code_base64}`} style={{ width: 300 }} />

                  <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                    <Box
                      sx={{
                        maxWidth: { xs: '60vw', md: '40vw' },
                        maxHeight: 40,
                        overflowX: 'auto',
                        overflowY: 'none'
                      }}
                    >
                      {qrPix?.qr_code}
                    </Box>
                    <Button variant='contained' color='secondary' onClick={() => handleCopy(qrPix?.qr_code)}>
                      Copiar
                    </Button>
                  </Box>
                </Box>)}

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                {qrPix ? (
                  <Button variant="outlined" onClick={() => createPayment()}>
                    Gerar novo Código PIX
                  </Button>
                ) : (
                  <Button variant="contained" onClick={() => createPayment()}>
                    Gerar QRcode
                  </Button>
                )}
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress color="success" />&nbsp;
              Carregando código PIX...
            </Box>
          )}</>
        )
      }

      {
        paymentType === 'bolbradesco' && (<>
          <Snackbar
            open={copySnackbar}
            message="Código copiado, agora é só colar no seu banco."
            anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
            onClose={handleCloseSnack}
            autoHideDuration={6000}
          />
          {!loadingPayment && !qrPix ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Alert severity="info">
                As leis Brasileiras exigem identidade para processar um pagamento.
              </Alert>
              <Alert severity="warning">
                Boleto costuma levar até 3 dias úteis para consta em sistema.
              </Alert>

              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mt: 2 }}>
                <TextField
                  label="CPF"
                  value={cpf}
                  onChange={handleCPFChange}
                  error={!!errors.cpf}
                  helperText={errors.cpf}
                  fullWidth
                  size='small'
                />

                <TextField
                  label="E-mail"
                  value={email}
                  onChange={handleEmailChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                  size='small'
                />
              </Box>

              <Button variant="contained" onClick={() => createPayment('bolbradesco')}>
                Gerar boleto
              </Button>
            </Box>
          ) : (
            !qrPix ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress color="success" />&nbsp;
                Gerando boleto...
              </Box>
            ) : (
              <section className="boleto-view">
                <div className="container">
                  <div className="box">
                    <div className="box-header">
                      <div className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path fill="#256EFF" d="M12,6a.99974.99974,0,0,0-1,1v4.42249l-2.09766,1.2113a1.00016,1.00016,0,0,0,1,1.73242l2.59766-1.5A1.00455,1.00455,0,0,0,13,12V7A.99974.99974,0,0,0,12,6Z" />
                          <path fill="#D3E2FF" d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm1,10a1.00455,1.00455,0,0,1-.5.86621l-2.59766,1.5a1.00016,1.00016,0,0,1-1-1.73242L11,11.42249V7a1,1,0,0,1,2,0Z" />
                        </svg>
                      </div>
                      <h2>Seu boleto ainda não foi pago</h2>
                      <h3>Realize o pagamento para receber seu pedido</h3>
                    </div>

                    <div className="box-content is-order-id">
                      <div>
                        <div className="label">PEDIDO</div>
                        <div><strong>{qrPix?.payment_method_reference_id}</strong></div>
                      </div>
                      <div>
                        <div className="label">VENCIMENTO</div>
                        <div><strong>{formatarVencimento(qrPix?.vencimento)}</strong></div>
                      </div>
                      <div>
                        <div className="label">VALOR</div>
                        <div><strong>{formatarValor(qrPix?.total_paid_amount)}</strong></div>
                      </div>
                    </div>

                    <div className="box-content">
                      <div className="label is-dark">CÓDIGO DE BARRAS:</div>
                      <div className="barcode-area">
                        <textarea readOnly>{qrPix?.digitable_line}</textarea>
                      </div>
                      <div className="buttons">
                        <button
                          id="copy_barcode"
                          type="button"
                          className="button barcode"
                          onClick={() => handleCopy(qrPix?.digitable_line)}>
                          <svg viewBox="0 0 16 12" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.65 0H1.35C.62 0 0 .6 0 1.26v9.54c0 .6.62 1.2 1.35 1.2h13.3c.73 0 1.35-.6 1.35-1.26V1.2c0-.6-.62-1.2-1.35-1.2zm.49 10.74c0 .24-.25.42-.5.42H1.36a.44.44 0 0 1-.34-.1.42.42 0 0 1-.15-.32V1.2c0-.24.25-.42.5-.42h13.29c.24 0 .49.24.49.42v9.6-.06zM2.46 2.2H4.1v7.6H2.46V2.2zm2.92 0h.83v7.6h-.83V2.2zm2.1 0h.83v7.6h-.82V2.2zm2.16 0h1.64v7.6H9.64V2.2zm2.87 0h1.03v7.6H12.5V2.2z" fillRule="nonzero" />
                          </svg>
                          <span>Copiar código de barras</span>
                        </button>

                        <a
                          id="whatapp_button"
                          href={`http://wa.me/?text=Acesse esse link para ver o boleto do pedido ${qrPix?.external_resource_url}`}
                          className="button green whatsapp"
                          rel="nofollow noopener"
                          target="_blank">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                          </svg>
                          <span>Enviar para WhatsApp</span>
                        </a>
                      </div>
                    </div>

                    <a href={qrPix?.external_resource_url} target="_blank" className="box-content boleto-original-link">
                      <span>Visualizar boleto</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </section>
            )
          )}
        </>)
      }

      {
        paymentType === 'account_money' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="warning">
              O pagamento por saldo em conta ainda não está disponível para você. Continue comprando para obter novas opções.
            </Alert>
            <Button variant="contained" onClick={() => pay()}>
              Próximo
            </Button>
          </Box>
        )
      }
    </Box >
  );
}

// Componente Review
function Review({ onNext, product }) {
  const { user } = useAuth();

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

  const calcularTotalCarrinho = () => {
    if (!user?.cart || user.cart.length === 0) return 0;

    // Passo 1: Somar os preços de todos os itens no carrinho
    const total = user.cart.reduce((acc, item) => {
      return acc + formatCurrencyToMercadoPago(item.price);  // Soma o preço do item
    }, 0);

    // Passo 2: Formatar o total
    return total.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    product ? (
      <Stack spacing={2}>
        <List disablePadding>
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary={product.title} />
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {product.price}
            </Typography>
          </ListItem>
        </List>
        <Divider />
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Total: R$ {product?.price}
        </Typography>
        <Button variant="contained" onClick={onNext} fullWidth>
          Próximo
        </Button>
      </Stack>
    ) : (
      <Stack spacing={2}>
        <List disablePadding>
          {user?.cart?.map((product) => (
            <ListItem sx={{ py: 1, px: 0 }}>
              <ListItemText primary={product.title} />
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                {product.price}
              </Typography>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Total: {calcularTotalCarrinho()}
        </Typography>
        <Button variant="contained" onClick={onNext} fullWidth>
          Próximo
        </Button>
      </Stack>
    )
  );
}

// Componente principal Checkout
export default function Checkout({ product, page, setPage }) {
  const { user } = useAuth();
  const [paymentType, setPaymentType] = React.useState('credit_card');
  const [activeStep, setActiveStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'Brasil',
  });

  const handlePayment = async () => {
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

  const calcularTotalCarrinho = () => {
    if (!user?.cart || user.cart.length === 0) return 0;

    // Passo 1: Somar os preços de todos os itens no carrinho
    const total = user.cart.reduce((acc, item) => {
      return acc + formatCurrencyToMercadoPago(item.price);
    }, 0);

    // Passo 2: Formatar o total
    return total.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const pay = () => {
    handlePayment();
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <AddressForm formData={formData} setFormData={setFormData} onNext={handleNext} />;
      case 1:
        return <Review onNext={handleNext} product={product} />;
      case 2:
        return <PaymentForm formData={formData} setFormData={setFormData} product={product} onNext={handleNext} paymentType={paymentType} setPaymentType={setPaymentType} pay={pay} setPage={setPage} />;
      default:
        throw new Error('Passo desconhecido');
    }
  };

  return (
    product ? (
      <Container sx={{ mt: 14 }}>
        <IconButton onClick={() => setPage('home')}>
          <ArrowBack />&nbsp; Voltar
        </IconButton>
        <CssBaseline enableColorScheme />
        <Grid container sx={{ height: '100vh', mt: { xs: 4, sm: 0 } }}>
          <Grid item xs={12} md={5} lg={4} sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', p: 4 }}>
            <Typography variant="h6" gutterBottom>
              Resumo do pedido
            </Typography>
            <List disablePadding>
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary={product.title} />
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {product.price}
                </Typography>
              </ListItem>
            </List>
            <Divider />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Total: R$ {product?.price}
            </Typography>
          </Grid>
          <Grid item xs={12} md={7} lg={8} sx={{ p: 4 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length ? (
              <Stack spacing={2}>
                <Typography variant="h1">📦</Typography>
                <Typography variant="h5">Obrigado pelo seu pedido!</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Seu número de pedido é <strong>#140396</strong>. Enviamos um e-mail de confirmação e atualizaremos você quando o pedido for enviado.
                </Typography>
                <Button variant="contained" sx={{ alignSelf: 'start' }}>
                  Ver meus pedidos
                </Button>
              </Stack>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  {activeStep !== 0 && (
                    <Button startIcon={<ChevronLeftRoundedIcon />} onClick={handleBack}>
                      Voltar
                    </Button>
                  )}
                </Box>
              </React.Fragment>
            )}
          </Grid>
        </Grid>
      </Container>
    ) : (
      <Container sx={{ mt: 14 }}>
        <IconButton onClick={() => setPage('home')}>
          <ArrowBack />&nbsp; Voltar
        </IconButton>
        <CssBaseline enableColorScheme />
        <Grid container sx={{ height: '100vh', mt: { xs: 4, sm: 0 } }}>
          <Grid item xs={12} md={5} lg={4} sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', p: 4 }}>
            <Typography variant="h6" gutterBottom>
              Resumo do pedido
            </Typography>
            <List disablePadding sx={{ overflowY: 'auto' }}>
              {user?.cart?.map((product) => (
                <ListItem sx={{ py: 1, px: 0 }}>
                  <ListItemText primary={product.title} />
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {product.price}
                  </Typography>
                </ListItem>
              ))}
            </List>
            <Divider />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Total: {calcularTotalCarrinho()}
            </Typography>
          </Grid>
          <Grid item xs={12} md={7} lg={8} sx={{ p: 4 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length ? (
              <Stack spacing={2}>
                <Typography variant="h1">📦</Typography>
                <Typography variant="h5">Obrigado pelo seu pedido!</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Seu número de pedido é <strong>#140396</strong>. Enviamos um e-mail de confirmação e atualizaremos você quando o pedido for enviado.
                </Typography>
                <Button variant="contained" sx={{ alignSelf: 'start' }}>
                  Ver meus pedidos
                </Button>
              </Stack>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  {activeStep !== 0 && (
                    <Button startIcon={<ChevronLeftRoundedIcon />} onClick={handleBack}>
                      Voltar
                    </Button>
                  )}
                </Box>
              </React.Fragment>
            )}
          </Grid>
        </Grid>
      </Container>
    )
  );
}