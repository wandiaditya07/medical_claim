import React, { useState } from "react";
import AppLayout from '../../layouts/AppLayout';
import SidebarHRD from "../../components/hrd/Sidebar";
import SidebarKaryawan from "../../components/karyawan/Sidebar";
import SidebarKeuangan from "../../components/keuangan/Sidebar";

const KeluargaKaryawan = () => {
  const role = localStorage.getItem("role");

  const [dataKeluarga, setDataKeluarga] = useState([
    {
      namaLengkap: "Siti Aminah",
      jenisKelamin: "Perempuan",
      hubunganKeluarga: "Istri",
      tanggalLahir: "1988-03-12",
      pekerjaan: "Ibu Rumah Tangga",
      noTelepon: "081234567890",
    },
  ]);

  const [formData, setFormData] = useState({
    namaLengkap: "",
    jenisKelamin: "",
    hubunganKeluarga: "",
    tanggalLahir: "",
    pekerjaan: "",
    noTelepon: "",
  });

  const [editIndex, setEditIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.namaLengkap ||
      !formData.jenisKelamin ||
      !formData.hubunganKeluarga ||
      !formData.tanggalLahir ||
      !formData.pekerjaan ||
      !formData.noTelepon
    ) {
      alert("Semua field harus diisi!");
      return;
    }

    if (editIndex !== null) {
      const updatedData = [...dataKeluarga];
      updatedData[editIndex] = formData;
      setDataKeluarga(updatedData);
      setEditIndex(null);
    } else {
      setDataKeluarga((prevData) => [...prevData, formData]);
    }

    setFormData({
      namaLengkap: "",
      jenisKelamin: "",
      hubunganKeluarga: "",
      tanggalLahir: "",
      pekerjaan: "",
      noTelepon: "",
    });
    setShowForm(false);
  };

  const handleEdit = (index) => {
    setFormData(dataKeluarga[index]);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus data?");
    if (confirmDelete) {
      const updatedData = [...dataKeluarga];
      updatedData.splice(index, 1);
      setDataKeluarga(updatedData);
    }
  };

  const sidebar =
    role === "hrd" ? (
      <SidebarHRD />
    ) : role === "keuangan" ? (
      <SidebarKeuangan />
    ) : (
      <SidebarKaryawan />
    );

  return (
    <AppLayout sidebar={SidebarHRD}>
      <div className="container-fluid py-4">
        <h4 className="fw-bold mb-4">Data Keluarga Karyawan</h4>

          <div className="mb-3 text-end">
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowForm(!showForm);
                setEditIndex(null);
                setFormData({
                  namaLengkap: "",
                  jenisKelamin: "",
                  hubunganKeluarga: "",
                  tanggalLahir: "",
                  pekerjaan: "",
                  noTelepon: "",
                });
              }}
            >
              {showForm ? "Tutup Form" : "+ Tambah Data"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="card p-3 mb-4 shadow-sm">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label>Nama Lengkap</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaLengkap"
                    value={formData.namaLengkap}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Jenis Kelamin</label>
                  <select
                    className="form-select"
                    name="jenisKelamin"
                    value={formData.jenisKelamin}
                    onChange={handleChange}
                  >
                    <option value="">-- Pilih --</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div className="col-md-4 mb-3">
                  <label>Hubungan Keluarga</label>
                  <input
                    type="text"
                    className="form-control"
                    name="hubunganKeluarga"
                    value={formData.hubunganKeluarga}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Tanggal Lahir</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggalLahir"
                    value={formData.tanggalLahir}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Pekerjaan</label>
                  <input
                    type="text"
                    className="form-control"
                    name="pekerjaan"
                    value={formData.pekerjaan}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>No Telepon</label>
                  <input
                    type="text"
                    className="form-control"
                    name="noTelepon"
                    value={formData.noTelepon}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <button className="btn btn-success" type="submit">
                {editIndex !== null ? "Simpan Perubahan" : "Simpan"}
              </button>
            </form>
          )}

          <table className="table table-bordered table-striped text-center">
            <thead className="table-secondary">
              <tr>
                <th>No</th>
                <th>Nama Lengkap</th>
                <th>Jenis Kelamin</th>
                <th>Hubungan Keluarga</th>
                <th>Tanggal Lahir</th>
                <th>Pekerjaan</th>
                <th>No Telepon</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataKeluarga.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                dataKeluarga.map((keluarga, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{keluarga.namaLengkap}</td>
                    <td>{keluarga.jenisKelamin}</td>
                    <td>{keluarga.hubunganKeluarga}</td>
                    <td>{keluarga.tanggalLahir}</td>
                    <td>{keluarga.pekerjaan}</td>
                    <td>{keluarga.noTelepon}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(index)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(index)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
    </AppLayout>
  );
};

export default KeluargaKaryawan;