export interface Anggota {
  id: string;
  nama: string;
  kelas?: string;
  kamar?: string;
  alamat?: string;
  motto?: string;
  keahlian?: string;
  foto?: string;
}

export interface Album {
  id: string;
  nama: string;
  desc?: string;
  createdAt?: string;
}

export interface Photo {
  id: string;
  albumId: string;
  url: string;
  createdAt: string;
}

export interface Quote {
  id: string;
  text: string;
  author?: string;
  cat?: string;
}

export interface Artikel {
  id: string;
  judul: string;
  penulis?: string;
  kat?: string;
  isi: string;
  cover?: string;
  date?: string;
  createdAt: string;
}

export interface Pengurus {
  id: string;
  nama: string;
  jabatan: string;
  foto?: string;
}

export interface Settings {
  about?: string;
  wa?: string;
  ig?: string;
  fb?: string;
  tt?: string;
  yt?: string;
}
