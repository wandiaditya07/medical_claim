Medical Claim web Project

include:
**Member** =
- _Wandi Aditya (230444180019)_
- _Fasya Hasna Aidah (230444180005)_

**Dependencies** =
- ``bash
- _git clone_
- _git cd medical_claim_

- _git cd frontend - backend
- _npm install_

**Users Management** =
- **HRD**: _hrd.admin@kantor.com_
- **Keuangan**: _keuangan.staff@kantor.com_
- **Karyawan**: (Created by HRD)

**Folder structure** = 

📦medical_claim
 
 ┣ 📂backend
 
 ┃ ┣ 📂config
 
 ┃ ┃ ┣ 📜db.js
 
 ┃ ┃ ┗ 📜jwt.js
 
 ┃ ┣ 📂controllers
 
 ┃ ┃ ┣ 📜authController.js
 
 ┃ ┃ ┣ 📜claimController.js
 
 ┃ ┃ ┣ 📜dependentController.js
 
 ┃ ┃ ┣ 📜employeeDataController.js
 
 ┃ ┃ ┣ 📜logController.js
 
 ┃ ┃ ┣ 📜reportController.js
 
 ┃ ┃ ┣ 📜searchController.js
 
 ┃ ┃ ┗ 📜userController.js
 
 ┃ ┣ 📂middleware
 
 ┃ ┃ ┣ 📜Auth.js
 
 ┃ ┃ ┗ 📜upload.js
 
 ┃ ┣ 📂package-frontend
 
 ┃ ┃ ┗ 📜package.json
 
 ┃ ┣ 📂routes
 
 ┃ ┃ ┣ 📜auth.js
 
 ┃ ┃ ┣ 📜claims.js
 
 ┃ ┃ ┣ 📜dependents.js
 
 ┃ ┃ ┣ 📜employees.js
 
 ┃ ┃ ┣ 📜karyawan.js
 
 ┃ ┃ ┣ 📜keuangan.js
 
 ┃ ┃ ┣ 📜logs.js
 
 ┃ ┃ ┣ 📜reports.js
 
 ┃ ┃ ┣ 📜search.js
 
 ┃ ┃ ┗ 📜users.js
 
 ┃ ┣ 📂test
 
 ┃ ┃ ┗ 📜addUser.js
 
 ┃ ┣ 📂uploads
 
 ┃ ┃ ┣ 📜receipt_file-1753507829943-338041314.jpg
 
 ┃ ┃ ┣ 📜receipt_file-1753513723121-51716465.jpg
 
 ┃ ┃ ┣ 📜receipt_file-1753515051421-443374454.png
 
 ┃ ┃ ┗ 📜receipt_file-1753523661994-634185834.jpg
 
 ┃ ┣ 📜.env
 
 ┃ ┣ 📜.gitignore
 
 ┃ ┣ 📜index.js
 
 ┃ ┣ 📜package-lock.json
 
 ┃ ┗ 📜package.json
 
 ┗ 📂frontend
 
 ┃ ┣ 📂public
 
 ┃ ┃ ┗ 📜vite.svg
 
 ┃ ┣ 📂src
 
 ┃ ┃ ┣ 📂api
 
 ┃ ┃ ┃ ┗ 📜axiosConfig.js
 
 ┃ ┃ ┣ 📂assets
 
 ┃ ┃ ┃ ┗ 📜react.svg
 
 ┃ ┃ ┣ 📂auth
 
 ┃ ┃ ┃ ┣ 📜LoginPage.jsx
 
 ┃ ┃ ┃ ┗ 📜PublicRoute.jsx
 
 ┃ ┃ ┣ 📂components
 
 ┃ ┃ ┃ ┣ 📂hrd
 
 ┃ ┃ ┃ ┃ ┣ 📜BarChart.jsx
 
 ┃ ┃ ┃ ┃ ┣ 📜PieChart.jsx
 
 ┃ ┃ ┃ ┃ ┣ 📜Sidebar.jsx
 
 ┃ ┃ ┃ ┃ ┗ 📜SummaryCard.jsx
 
 ┃ ┃ ┃ ┣ 📂karyawan
 
 ┃ ┃ ┃ ┃ ┣ 📜BarChart.jsx
 
 ┃ ┃ ┃ ┃ ┣ 📜PieChart.jsx
 
 ┃ ┃ ┃ ┃ ┣ 📜Sidebar.jsx
 
 ┃ ┃ ┃ ┃ ┗ 📜SummaryCard.jsx
 
 ┃ ┃ ┃ ┣ 📂keuangan
 
 ┃ ┃ ┃ ┃ ┣ 📜BarChart.jsx
 
 ┃ ┃ ┃ ┃ ┣ 📜PieChart.jsx
 
 ┃ ┃ ┃ ┃ ┣ 📜Sidebar.jsx
 
 ┃ ┃ ┃ ┃ ┗ 📜SummaryCard.jsx
 
 ┃ ┃ ┃ ┣ 📂modals
 
 ┃ ┃ ┃ ┃ ┣ 📂hrd
 
 ┃ ┃ ┃ ┃ ┃ ┣ 📜ActivationModal.jsx
 
 ┃ ┃ ┃ ┃ ┃ ┣ 📜AddEditDependentModal.jsx
 
 ┃ ┃ ┃ ┃ ┃ ┣ 📜AddEmployeeModal.jsx
 
 ┃ ┃ ┃ ┃ ┃ ┣ 📜ApprovalActionModal.jsx
 
 ┃ ┃ ┃ ┃ ┃ ┣ 📜ChangePasswordModal.jsx
 
 ┃ ┃ ┃ ┃ ┃ ┣ 📜DeleteDependentConfirmModal.jsx
 
 ┃ ┃ ┃ ┃ ┃ ┣ 📜DeleteEmployeeConfirmModal.jsx
 
 ┃ ┃ ┃ ┃ ┃ ┣ 📜EditEmployeeModal.jsx
 
 ┃ ┃ ┃ ┃ ┃ ┗ 📜EmployeeDetailModal.jsx
 
 ┃ ┃ ┃ ┃ ┣ 📂karyawan
 
 ┃ ┃ ┃ ┃ ┗ 📂keuangan
 
 ┃ ┃ ┃ ┣ 📜DynamicSidebar.jsx
 
 ┃ ┃ ┃ ┣ 📜Footer.jsx
 
 ┃ ┃ ┃ ┗ 📜Navbar.jsx
 
 ┃ ┃ ┣ 📂layouts
 
 ┃ ┃ ┃ ┗ 📜AppLayout.jsx
 
 ┃ ┃ ┣ 📂pages
 
 ┃ ┃ ┃ ┣ 📂global
 
 ┃ ┃ ┃ ┃ ┗ 📜ProfilePage.jsx
 
 ┃ ┃ ┃ ┣ 📂hrd
 
 ┃ ┃ ┃ ┃ ┣ 📜AktivasiKaryawan.jsx
 
 ┃ ┃ ┃ ┃ ┣ 📜Dashboard.jsx
 
 ┃ ┃ ┃ ┃ ┣ 📜DataKaryawan.jsx
 
 ┃ ┃ ┃ ┃ ┣ 📜HistoryPage.jsx
 
 ┃ ┃ ┃ ┃ ┗ 📜PersetujuanHRD.jsx
 
 ┃ ┃ ┃ ┣ 📂karyawan
 
 ┃ ┃ ┃ ┃ ┣ 📜Dashboard.jsx
 
 ┃ ┃ ┃ ┃ ┣ 📜DataKeluarga.jsx
 
 ┃ ┃ ┃ ┃ ┣ 📜PengajuanKlaim.jsx
 
 ┃ ┃ ┃ ┃ ┗ 📜RiwayatKlaim.jsx
 
 ┃ ┃ ┃ ┣ 📂keuangan
 
 ┃ ┃ ┃ ┃ ┣ 📜Dashboard.jsx
 
 ┃ ┃ ┃ ┃ ┣ 📜PencairanKeuangan.jsx
 
 ┃ ┃ ┃ ┃ ┗ 📜RiwayatPembayaran.jsx
 
 ┃ ┃ ┃ ┗ 📜SearchResultPage.jsx
 
 ┃ ┃ ┣ 📂routes
 
 ┃ ┃ ┃ ┣ 📜AppRoutes.jsx
 
 ┃ ┃ ┃ ┣ 📜RoleRoute.jsx
 
 ┃ ┃ ┃ ┗ 📜UnauthorizedPage.jsx
 
 ┃ ┃ ┣ 📂utils
 
 ┃ ┃ ┃ ┗ 📜formatCurrency.js
 
 ┃ ┃ ┣ 📜App.css
 
 ┃ ┃ ┣ 📜App.jsx
 
 ┃ ┃ ┣ 📜index.css
 
 ┃ ┃ ┗ 📜main.jsx
 
 ┃ ┣ 📜.gitignore
 
 ┃ ┣ 📜eslint.config.js
 
 ┃ ┣ 📜index.html
 
 ┃ ┣ 📜package-lock.json
 
 ┃ ┣ 📜package.json
 
 ┃ ┣ 📜README.md
 
 ┃ ┗ 📜vite.config.js



