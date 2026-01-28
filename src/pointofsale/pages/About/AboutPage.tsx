import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  IconButton,
  Card,
  CardContent,
  Fade,
  Grow,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import {
  Store as StoreIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

const features = [
  {
    icon: <StoreIcon sx={{ fontSize: 40 }} />,
    title: "Tecnología de Vanguardia",
    description:
      "Nuestra plataforma está diseñada para ofrecer una experiencia de ventas fluida y profesional.",
    color: "primary",
    delay: 0,
  },
  {
    icon: <PeopleIcon sx={{ fontSize: 40 }} />,
    title: "Atención al Cliente",
    description:
      "Brindamos soporte excepcional para nuestros clientes, asegurando una experiencia sin inconvenientes.",
    color: "success",
    delay: 200,
  },
  {
    icon: <BusinessIcon sx={{ fontSize: 40 }} />,
    title: "Soluciones Empresariales",
    description:
      "Ofrecemos herramientas que se adaptan a las necesidades de tu negocio, mejorando la productividad.",
    color: "warning",
    delay: 400,
  },
  {
    icon: <InfoIcon sx={{ fontSize: 40 }} />,
    title: "Transparencia y Confianza",
    description:
      "Nuestra misión es ser transparentes con nuestros usuarios, brindando confianza en cada transacción.",
    color: "secondary",
    delay: 600,
  },
];

const missionVision = [
  {
    title: "Misión",
    description:
      "Brindar soluciones integrales en tecnología de punto de venta que optimicen el rendimiento de negocios de todas las escalas.",
    icon: "🎯",
    color: "primary",
  },
  {
    title: "Visión",
    description:
      "Ser la empresa líder en soluciones tecnológicas para el comercio, impulsando el éxito de nuestros clientes a nivel global.",
    icon: "🔭",
    color: "success",
  },
];

const AboutPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Función para obtener el color según el tipo
  const getColor = (colorType: string) => {
    const colors = {
      primary: theme.palette.primary.main,
      success: theme.palette.success.main,
      warning: theme.palette.warning.main,
      secondary: theme.palette.secondary.main,
    };
    return (
      colors[colorType as keyof typeof colors] || theme.palette.primary.main
    );
  };

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.background.default,
          0.8
        )} 0%, ${alpha(theme.palette.grey[50], 0.9)} 100%)`,
        minHeight: "100vh",
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section con animación */}
        <Fade in={isVisible} timeout={800}>
          <Box
            sx={{
              textAlign: "center",
              mb: 8,
              px: isMobile ? 2 : 0,
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: "bold",
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                mb: 3,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
              }}
            >
              Acerca de Nuestro Punto de Venta
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{
                color: "text.secondary",
                maxWidth: "600px",
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              Proporcionando soluciones de ventas eficientes y confiables para
              impulsar tu negocio
            </Typography>
          </Box>
        </Fade>

        {/* Características principales */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Grow
                in={isVisible}
                timeout={800}
                style={{ transitionDelay: `${feature.delay}ms` }}
              >
                <Card
                  sx={{
                    height: "100%",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 4,
                      background: `linear-gradient(135deg, ${alpha(
                        getColor(feature.color),
                        0.05
                      )} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 4 }}>
                    <IconButton
                      sx={{
                        color: getColor(feature.color),
                        mb: 2,
                        backgroundColor: alpha(getColor(feature.color), 0.1),
                        "&:hover": {
                          backgroundColor: alpha(getColor(feature.color), 0.2),
                        },
                      }}
                    >
                      {feature.icon}
                    </IconButton>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: "bold",
                        mb: 2,
                        color: "text.primary",
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.6,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>

        {/* Misión y Visión */}
        <Fade in={isVisible} timeout={1000}>
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                mb: 6,
                color: "text.primary",
              }}
            >
              Nuestra Misión y Visión
            </Typography>
            <Grid container spacing={4}>
              {missionVision.map((item, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Grow
                    in={isVisible}
                    timeout={1200}
                    style={{ transitionDelay: `${index * 300}ms` }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        background: `linear-gradient(135deg, ${alpha(
                          getColor(item.color),
                          0.1
                        )} 0%, ${alpha(
                          theme.palette.background.paper,
                          1
                        )} 100%)`,
                        border: `1px solid ${alpha(getColor(item.color), 0.2)}`,
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.02)",
                          boxShadow: 3,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 4, textAlign: "center" }}>
                        <Typography variant="h4" sx={{ mb: 2 }}>
                          {item.icon}
                        </Typography>
                        <Typography
                          variant="h5"
                          component="h3"
                          sx={{
                            fontWeight: "bold",
                            mb: 3,
                            color: getColor(item.color),
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "text.secondary",
                            lineHeight: 1.7,
                            fontSize: "1.1rem",
                          }}
                        >
                          {item.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>

        {/* Sección adicional de valores */}
        <Fade in={isVisible} timeout={1400}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.05
              )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
              p: 4,
              mb: 4,
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: "bold",
                  mb: 3,
                  color: "text.primary",
                }}
              >
                Nuestros Valores
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "text.secondary",
                  maxWidth: "800px",
                  mx: "auto",
                  lineHeight: 1.8,
                }}
              >
                Creemos en la innovación constante, la transparencia en cada
                interacción, el compromiso con el éxito de nuestros clientes y
                la excelencia en todo lo que hacemos.
              </Typography>
            </CardContent>
          </Card>
        </Fade>

        {/* Créditos - Creado por AlonsDev */}
        <Fade in={isVisible} timeout={1600}>
          <Box
            sx={{
              textAlign: "center",
              mt: 4,
              pt: 2,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontStyle: "italic",
                opacity: 0.8,
              }}
            >
              AlonsDev - Todos los derechos reservados © {new Date().getFullYear()}
            </Typography>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default AboutPage;