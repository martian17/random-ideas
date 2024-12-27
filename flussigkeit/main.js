import {fft,ifft} from "flat-fft";




// Setup calculation template for order 10 FFT (1024 complex numbers in length)
const FFT1024 = new FlatFFT(10);

// Create a range of complex numbers as Float32Array.
const original = FlatFFT.toComplex(new Array(1024).fill(0).map((_,i)=>i));
// perform FFT
const transformed = FFT1024.fft(original);
// perform IFFT
const reconstructed = FFT1024.ifft(transformed);

console.log(original, transformed, reconstructed);
