// src/utils/formatCurrency.js

/**
 * Memformat angka menjadi format mata uang Rupiah (Rp).
 * @param {number} number - Angka yang akan diformat.
 * @returns {string} - String yang sudah diformat, contoh: "Rp 1.500.000".
 */
export const formatCurrency = (number) => {
  // Cek jika input adalah angka yang valid
  if (number === null || number === undefined || isNaN(Number(number))) {
    return "-"; // Kembalikan strip jika tidak valid
  }

  // Gunakan Intl.NumberFormat untuk performa dan akurasi terbaik
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0, // Tidak menampilkan angka di belakang koma
    maximumFractionDigits: 0, // Tidak menampilkan angka di belakang koma
  }).format(number);
};