const fs = require('fs');

removePorts = (str) => {
  return str.replace(/export |import .+\n/g, '');
}

fs.mkdir('tmp', () => {
  let fileStream = fs.createWriteStream('tmp/bundle.ts', {'flags': 'w'});

  fileStream.write('(function(){');
  fileStream.write(removePorts(fs.readFileSync('src/utils/interfaces.ts').toString()));
  fileStream.write(removePorts(fs.readFileSync('src/utils/defaults.ts').toString()));
  fileStream.write(removePorts(fs.readFileSync('src/utils/utils.ts').toString()));
  fileStream.write(removePorts(fs.readFileSync('src/particle.ts').toString()));
  fileStream.write(removePorts(fs.readFileSync('src/particles.ts').toString()));
  fileStream.write('window["Particles"] = Particles;');
  fileStream.write('})()');
  fileStream.end();
})