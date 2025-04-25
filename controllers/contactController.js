const emailService = require('../services/emailService');

exports.sendContactEmail = async (req, res) => {
  try {
    const { name, email, phone, subject, message, recipient } = req.body;
    
    // Validation des champs
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Veuillez remplir tous les champs obligatoires' });
    }
    
    // Envoi de l'email
    await emailService.sendContactEmail(name, email, phone, subject, message, recipient);
    
    res.status(200).json({ message: 'Message envoyé avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de l\'envoi du message' });
  }
};