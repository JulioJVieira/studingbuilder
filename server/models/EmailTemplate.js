const mongoose = require('mongoose');
const Handlebars = require('handlebars');

const EmailTemplate = mongoose.model('EmailTemplate', {
  name: {
    type: String,
    required: true,
    unique: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

async function insertTemplates() {
  const templates = [
    {
      name: 'welcome',
      subject: 'Bem vindo ao BuiderBook',
      message: `{{userName}},
        <p>
         Obrigado por se inscrever!
        </p>
        <p>
          Em nosso Livro, ensinaremos a você a desenvolver web apps para produção.
        </p>
        <p>
          O códico do nosso livro será livre e aberto
        </p>
      
        Julio, Team Builder Book
      `,
    },
  ];

  for (let i = 0; i < templates.length; i += 1) {
    const t = templates[i];

    // eslint-disable-next-line no-await-in-loop
    const count = await EmailTemplate.find({ name: t.name }).count();
    /*eslint-disable */
    if (count === 0) {
      EmailTemplate.create(
        Object.assign({}, t, {
          message: t.message.replace(/\n/g, "").replace(/[ ]+/g, " ")
        })
      );
    }
  }
}
/* eslint-enable */
insertTemplates();

async function getEmailTemplate(name, params) {
  const source = await EmailTemplate.findOne({ name });
  if (!source) {
    throw new Error('not found');
  }

  return {
    message: Handlebars.compile(source.message)(params),
    subject: Handlebars.compile(source.subject)(params),
  };
}

module.exports = getEmailTemplate;
