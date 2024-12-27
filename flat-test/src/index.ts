import { FlatFFT } from "flat-fft";

console.log(FlatFFT.toComplex([1, 2, 3, 4]));
const fft = new FlatFFT(2);
console.log(fft.fft(FlatFFT.toComplex([1, 2, 3, 4])));
console.log(fft.ifft(fft.fft(FlatFFT.toComplex([1, 2, 3, 4]))));



import fftjs from 'fft-js';
console.log(fftjs.fft([1,2,3,4]));
console.log(fftjs.ifft(fftjs.fft([1,2,3,4])));



console.log(fft.ifft(FlatFFT.toComplex([1, 2, 3, 4])));
console.log(fftjs.ifft([[1,0],[2,0],[3,0],[4,0]]));
