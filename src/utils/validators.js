// utils / validators .js
const estNonVide = (chaine) => typeof chaine === 'string' && chaine.trim().length > 0;
const estEmailValide = (email) => {
  return typeof email === 'string' && email.trim().length > 0 && /^\S+@\S+\.\S+$/.test(email);
};
module.exports = { estNonVide, estEmailValide };