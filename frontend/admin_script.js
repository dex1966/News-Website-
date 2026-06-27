(function () {
  // Đường dẫn URL chung tới PHP Backend (chạy trên cổng 8080 của XAMPP)
  const API_URL = 'http://localhost:8080/news-backend/api'; 

  const form = document.querySelector("#login-form");
  const usernameInput = document.querySelector("#username"); 
  const passwordInput = document.querySelector("#password"); 
  const remember = document.querySelector("#remember");
  const message = document.querySelector("#form-message");
  const toggle = document.querySelector(".password-toggle");
  const timeNode = document.querySelector("#current-time");
  const submitButton = document.querySelector("#btn-login"); 

  // 1. Khởi tạo dữ liệu ghi nhớ đăng nhập ban đầu
  const savedUser = window.localStorage.getItem("newsAdminUser");
  if (savedUser && usernameInput) {
    usernameInput.value = savedUser;
    if (remember) remember.checked = true;
  }

  function bootIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // 2. Logic đồng hồ hiển thị trên thanh sự kiện
  function formatClock(date) {
    const days = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    const pad = (value) => String(value).padStart(2, "0");
    return `${days[date.getDay()]} , ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} | ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  function tickClock() {
    if (!timeNode) return;
    const now = new Date();
    timeNode.textContent = formatClock(now);
    timeNode.setAttribute("datetime", now.toISOString());
  }

  // 3. Hiển thị thông báo lỗi Validate tại chỗ
  function setFieldError(input, text) {
    if (!input) return;
    const group = input.closest(".field-group");
    if (!group) return;
    const shell = group.querySelector(".input-shell");
    const error = group.querySelector(".field-error");

    if (shell) shell.classList.toggle("is-invalid", Boolean(text));
    if (error) error.textContent = text;
  }

  function validateForm() {
    let isValid = true;
    const userValue = usernameInput ? usernameInput.value.trim() : "";
    const passValue = passwordInput ? passwordInput.value.trim() : "";

    if (usernameInput) setFieldError(usernameInput, "");
    if (passwordInput) setFieldError(passwordInput, "");

    if (!userValue) {
      if (usernameInput) setFieldError(usernameInput, "Vui lòng nhập tài khoản email.");
      isValid = false;
    }

    if (!passValue) {
      if (passwordInput) setFieldError(passwordInput, "Vui lòng nhập mật khẩu.");
      isValid = false;
    }

    return isValid;
  }

  // 4. Bắt sự kiện ẩn/hiện mật khẩu
  if (toggle && passwordInput) {
    toggle.addEventListener("click", function () {
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";
      toggle.setAttribute("aria-label", isHidden ? "Ẩn mật khẩu" : "Hiện mật khẩu");
      toggle.setAttribute("aria-pressed", String(isHidden));
      toggle.innerHTML = isHidden ? '<i data-lucide="eye-off" aria-hidden="true"></i>' : '<i data-lucide="eye" aria-hidden="true"></i>';
      bootIcons();
    });
  }

  if (usernameInput && passwordInput) {
    [usernameInput, passwordInput].forEach((input) => {
      input.addEventListener("input", function () {
        setFieldError(input, "");
        if (message) {
          message.textContent = "";
          message.className = "form-message";
        }
      });
    });
  }

  // 5. KẾT NỐI API ĐĂNG NHẬP SANG PHP BACKEND
  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault(); 
      if (!message) return;

      message.textContent = "";
      message.className = "form-message";

      if (!validateForm()) {
        message.textContent = "Kiểm tra lại thông tin đăng nhập.";
        message.classList.add("is-error");
        return;
      }

      if (remember && remember.checked) {
        window.localStorage.setItem("newsAdminUser", usernameInput.value.trim());
      } else {
        window.localStorage.removeItem("newsAdminUser");
      }

      if (submitButton) {
        submitButton.disabled = true;
        const btnText = submitButton.querySelector("span");
        if (btnText) btnText.textContent = "Đang xác thực hệ thống...";
      }

      const email = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      try {
        const response = await fetch(`${API_URL}/auth.php?action=login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        // ĐÃ CẢI TIẾN: Bọc kiểm tra dữ liệu JSON an toàn để tránh bị crash code khi PHP báo lỗi chữ
        let data = {};
        const responseText = await response.text();
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error("Backend không trả về JSON chuẩn:", responseText);
          throw new Error("Dữ liệu phản hồi từ Server không đúng định dạng JSON.");
        }

        if (response.ok) {
          message.textContent = "Đăng nhập thành công! Đang chuyển hướng...";
          message.className = "form-message is-success";

          localStorage.setItem('user', JSON.stringify(data.user || { email: email })); 

          setTimeout(() => {
            window.location.href = 'admin_dashboard.html'; 
          }, 1000);
        } else {
          message.textContent = data.error || "Tài khoản hoặc mật khẩu không chính xác.";
          message.className = "form-message is-error";
          resetSubmitButton();
        }
      } catch (error) {
        console.error('Lỗi kết nối API:', error);
        message.textContent = "Không thể kết nối đến máy chủ PHP hoặc phản hồi lỗi. Hãy đảm bảo XAMPP Apache đang bật cổng 8080 và tài khoản chính xác!";
        message.className = "form-message is-error";
        resetSubmitButton();
      }
    });
  }

  function resetSubmitButton() {
    if (submitButton) {
      submitButton.disabled = false;
      const btnText = submitButton.querySelector("span");
      if (btnText) btnText.textContent = "Đang nhập hệ thống";
    }
  }

  // --- LOGIC PHẦN QUẢN LÝ BÀI VIẾT ---
  async function loadArticles() {
    const tableBody = document.getElementById('article-table-body');
    if (!tableBody) return; 

    try {
      const response = await fetch(`${API_URL}/articles.php`, {
        method: 'GET'
      });

      if (!response.ok) return;
      const articles = await response.json();
      tableBody.innerHTML = ''; 

      articles.forEach((article, index) => {
        tableBody.innerHTML += `
          <tr>
            <td>${index + 1}</td>
            <td>${article.title}</td>
            <td>${article.category_name || 'Không có'}</td>
            <td>${article.author || 'Admin'}</td>
            <td><span class="badge">Đã đăng</span></td>
            <td>
              <button class="btn-edit" data-id="${article.id}">Sửa</button>
              <button class="btn-delete" data-id="${article.id}">Xóa</button>
            </td>
          </tr>
        `;
      });
    } catch (error) {
      console.error('Không thể tải danh sách bài viết:', error);
    }
  }

  const btnSaveArticle = document.getElementById('btn-save-article');
  if (btnSaveArticle) {
    btnSaveArticle.addEventListener('click', async (e) => {
      e.preventDefault();

      const titleInput = document.getElementById('input-title');
      const contentInput = document.getElementById('textarea-content');
      const categoryInput = document.getElementById('select-category');
      
      if (!titleInput || !contentInput || !categoryInput) return;

      const newArticle = {
        title: titleInput.value,
        summary: document.getElementById('textarea-summary') ? document.getElementById('textarea-summary').value : '', 
        content: contentInput.value,
        image_url: document.getElementById('input-image') ? document.getElementById('input-image').value : '', 
        category_id: categoryInput.value,
        author: 'Admin'
      };

      try {
        const response = await fetch(`${API_URL}/articles.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newArticle)
        });

        if (response.ok) {
          alert('Thêm bài viết mới thành công!');
          titleInput.value = '';
          contentInput.value = '';
          loadArticles(); 
        } else {
          alert('Có lỗi xảy ra khi lưu bài viết từ hệ thống.');
        }
      } catch (error) {
        console.error('Lỗi lưu bài viết:', error);
      }
    });
  }

  // Khởi chạy các hàm hệ thống ban đầu
  tickClock();
  setInterval(tickClock, 1000);
  bootIcons();
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadArticles);
  } else {
    loadArticles();
  }
})();

// Cấu hình URL của Backend PHP của bạn
const API_URL = 'http://localhost:8080/news-backend/api';

// Hàm tự động chạy khi trang quản lý bài viết được tải xong
async function loadArticles() {
    try {
        const response = await fetch(`${API_URL}/articles.php`, { // Đảm bảo đúng file xử lý articles của backend
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Gửi kèm token nếu API yêu cầu bảo mật
            }
        });

        // Kiểm tra nếu request thất bại
        if (!response.ok) {
            throw new Error('Lỗi khi lấy dữ liệu từ server');
        }

        const articles = await response.json();
        const tableBody = document.getElementById('article-table-body'); // ID của thẻ <tbody> trong HTML
        
        if (!tableBody) return;
        tableBody.innerHTML = ''; // Xóa dữ liệu cũ (nếu có)

        // Duyệt qua danh sách bài viết nhận từ Backend và chèn vào HTML
        articles.forEach((article, index) => {
            tableBody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td><strong>${article.title || 'Không có tiêu đề'}</strong></td>
                    <td><span class="category-tag">${article.categoryName || 'Chưa phân loại'}</span></td>
                    <td>${article.author || 'Ẩn danh'}</td>
                    <td><span class="badge status-${article.status ? article.status.toLowerCase() : 'default'}">${article.status || 'Chờ duyệt'}</span></td>
                    <td>
                        <button class="btn-edit" onclick="editArticle(${article.id})">Sửa</button>
                        <button class="btn-delete" onclick="deleteArticle(${article.id})">Xóa</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Không thể tải danh sách bài viết:', error);
    }
}

// Các hàm xử lý hành động (bổ sung để không bị lỗi "not defined" khi bấm nút)
function editArticle(id) {
    alert('Sửa bài viết có ID: ' + id);
    // Logic sửa bài viết viết ở đây
}

function deleteArticle(id) {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
        alert('Xóa bài viết có ID: ' + id);
        // Logic gọi API xóa viết ở đây
    }
}

// Gọi hàm chạy ngay khi load trang
document.addEventListener('DOMContentLoaded', loadArticles);