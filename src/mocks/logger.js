const logger = require('../config/logger');

// TEST ALL TYPES OF LOGS MESSAGES
function getLogger(req, res) {
    logger.debug('Este es un mensaje de debug');
    logger.http('Este es un mensaje de http');
    logger.info('Este es un mensaje de info');
    logger.warning('Este es un mensaje de warning');
    logger.error('Este es un mensaje de error');
    logger.fatal('Este es un mensaje de fatal');
    
    res.send('Verificar la consola, y en caso de estar en producción verificar el archivo "errors.log" en "src/logs"');
  }

  module.exports = {
    getLogger
  };