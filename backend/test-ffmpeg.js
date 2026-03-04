const { spawn } = require('child_process');

console.log('Testing FFmpeg installation...\n');

// Test 1: Check FFmpeg version
console.log('Test 1: Checking FFmpeg version...');
const versionTest = spawn('ffmpeg', ['-version']);

versionTest.stdout.on('data', (data) => {
  console.log('✅ FFmpeg found!');
  console.log(data.toString().split('\n')[0]);
});

versionTest.stderr.on('data', (data) => {
  console.log(data.toString());
});

versionTest.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ FFmpeg is installed correctly\n');
    
    // Test 2: Generate a test frame
    console.log('Test 2: Generating test frame...');
    const frameTest = spawn('ffmpeg', [
      '-f', 'lavfi',
      '-i', 'testsrc=size=640x480:rate=1',
      '-vframes', '1',
      '-c:v', 'mjpeg',
      '-f', 'image2pipe',
      'pipe:1'
    ]);

    let frameData = Buffer.alloc(0);

    frameTest.stdout.on('data', (data) => {
      frameData = Buffer.concat([frameData, data]);
    });

    frameTest.on('close', (code) => {
      if (code === 0 && frameData.length > 0) {
        console.log(`✅ Generated test frame: ${frameData.length} bytes`);
        console.log('\n🎉 All tests passed! FFmpeg is working correctly.\n');
      } else {
        console.log('❌ Failed to generate test frame');
      }
    });

    frameTest.stderr.on('data', (data) => {
      // Suppress FFmpeg info output
    });

  } else {
    console.log('❌ FFmpeg not found or not working');
    console.log('Please install FFmpeg and add it to your PATH');
  }
});

versionTest.on('error', (error) => {
  console.log('❌ FFmpeg not found!');
  console.log('Error:', error.message);
  console.log('\nPlease install FFmpeg from: https://ffmpeg.org/download.html');
  console.log('And add it to your system PATH');
});
