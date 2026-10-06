import rateLimit from 'express-rate-limit';
//limite les tentatives sur le login et l'inscription parent
export const limiteur = rateLimit({
  windowMs: 15 * 60 * 1000,  // fenêtre de 15 minutes
  limit: 10,  
  standardHeaders: true,
  legacyHeaders: false,                            
  skip: () => process.env.NODE_ENV === 'test',
  message: { success: false, message: 'Trop de tentatives, réessayez plus tard' },
});
