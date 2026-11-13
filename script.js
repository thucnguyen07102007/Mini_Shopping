//có sẳn: btn-add,item-list,completed-items,item-name
const btnAdd = document.getElementById("btn-add");
const itemList = document.getElementById("item-list");
// const completedItems = document.getElementById("completed-items");

// tự thêm id bên hmtl: item-name,item-price, remaining-count,total-cost,add-form
const nameInput = document.getElementById("item-name");
const priceInput = document.getElementById("item-price");
const addForm = document.getElementById("add-form");
const remainingCount = document.getElementById("remaining-count");
const totalCost = document.getElementById("total-cost");

// Dữ liệu sản phẩm ban đầu
let items = [
  { id: 1, name: "Sữa tươi", price: 32000, purchased: false },
  { id: 2, name: "Trứng gà", price: 45000, purchased: true },
  { id: 3, name: "Rau cải", price: 18000, purchased: false },
  { id: 4, name: "Bánh mì", price: 20000, purchased: false },
];

let nextId = 5;// ID tự tăng cho món mới
let currentFilter = "all";// Trạng thái lọc hiện tại
let currentTab = "list";// Trạng thái trang hiện tại

//Hàm hiển thị tiền theo định dạng Việt Nam
function formatMoney(price) {
  return price.toLocaleString("vi-VN") + " đ";
}

//phần 1: Hàm hiển thị danh sách các sản phẩm
function renderItems() {
  itemList.innerHTML = ""; //xóa danh sách cũ trước khi hiển thị danh sách mới

  //lọc danh sách theo trạng thái
  let filteredItems = items.filter((item) => {
    if (currentTab === "done") {
      return item.purchased;
    }
    if (currentFilter === "pending") {
      return !item.purchased;
    }
    if (currentFilter === "completed") {
      return item.purchased;
    }
    return true; // hiển thị tất cả các sản phẩm
  });

  //nếu không có sản phẩm nào thì hiển thị thông báo
  if (filteredItems.length === 0) {
    itemList.innerHTML = "<div class='no-items'>Không có sản phẩm nào</div>";
    updateSummaryOnly();
    return;
  }

  //Duyệt từng món và tạo html
  filteredItems.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item";

    //tạo class khi món đã mua
    if (item.purchased) {
      div.classList.add("purchased");
    }

    //phần tên món và checkbox
    const label = document.createElement("div");
    label.className = "item-label";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.checked = item.purchased;

    checkbox.setAttribute("aria-label", "đã mua " + item.name);

    //khi tích checkbock thì cập nhật trạng thái món đã mua và hiển thị lại danh sách
    checkbox.addEventListener("change", function () {
      togglePurchased(item.id);
    });

    const name = document.createElement("div");
    name.className = "item-name";
    name.textContent = item.name;

    label.appendChild(checkbox);
    label.appendChild(name);

    //phần giá dự kiến
    const price = document.createElement("div");
    price.className = "item-price";

    price.textContent = formatMoney(item.price);

    //nút xóa món
    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.className = "button delete";
    deleteButton.textContent = "Xóa";
    deleteButton.setAttribute("aria-label", "Xóa " + item.name);

    deleteButton.addEventListener("click", function () {
      deleteItem(item.id);
    });

    //ghép các phần lại với nhau
    div.appendChild(label);
    div.appendChild(price);
    div.appendChild(deleteButton);
    itemList.appendChild(div);
  });

  //cập nhật lại phần tổng số món chưa mua và tổng dự kiến
  updateRemainingCount();
  updateTotalCost();
}

//Phần 2: Hàm thêm sản phẩm mới vào danh sách
function addItem() {
  const name = nameInput.value.trim();
  const priceValid = priceInput.value.trim();
  const price = Number(priceValid);

  //kiểm tra tên món không được để trống
  if (name === "") {
    alert("Tên món không được để trống");
    nameInput.focus();
    return;
  }
  //kiểm tra giá không phải số âm
  if (priceValid === "" || !Number.isInteger(price) || price < 0) {
    alert("Giá dự kiến phải là số nguyên và lớn hơn hoặc bằng 0");
    priceInput.focus();
    return;
  }

  //tạo món mới
  const newItem = {
    id: nextId++,
    name: name,
    price: price,
    purchased: false,
  };

  //them món mới vào danh sách
  items.push(newItem);

  //xóa dữ liệu trong ô nhập liệu
  nameInput.value = "";
  priceInput.value = "";

  //chuyển về danh sách tất cả các món
  currentFilter = "all";
  upDateFiltersButtons();
  switchTab("list");

  //cập nhật giao diện
  upDateFiltersButtons();
  renderItems();
}

//Phần 3: Đánh dấu món đã mua
function togglePurchased(id) {
  const item = items.find((item) => item.id === id);
  if (!item) return;
  //đảo trang thái món đã mua/chưa mua
  item.purchased = !item.purchased;
  renderItems(); //hiển thị lại danh sách
}

//Phần 4: Xóa món khỏi danh sách
function deleteItem(id) {
  //loại bỏ món có id trùng với id được truyền vào
  items = items.filter((item) => item.id !== id);
  //cập nhận giao diện
  renderItems();
}

//Phần 5: lọc danh sách theo trạng thái
function filterItems(filter) {
  currentFilter = filter;
  currentTab = "list";
  switchTab("list");
  upDateFiltersButtons(); //cập nhật nút đang được chọn
  renderItems(); //hiển thị lại danh sách đã lọc
}
function upDateFiltersButtons() {
  const buttons = {
    all: document.getElementById("filters-all"),
    pending: document.getElementById("filters-pending"),
    completed: document.getElementById("filters-completed"),
  };
  Object.keys(buttons).forEach((key) => {
    buttons[key].classList.toggle("active", currentFilter === key);
  });
}

//phần 6: đếm món chưa mua
function updateRemainingCount() {
  // Đếm những món chưa được mua
  const count = items.filter((item) => {
    return !item.purchased;
  }).length;
  // Cập nhật số lượng lên HTML
  remainingCount.textContent = count;
}
//Phần 7: tính tổng dự kiến
function updateTotalCost() {
  //tính tổng dự kiến
  const total = items
    .filter((item) => !item.purchased)
    .reduce((sum, item) => {
      return sum + item.price;
    }, 0);

  //hiển thị tổng dự kiến vào giao diện
  totalCost.innerHTML = formatMoney(total) + " <div class='currency'>đ</div>";
}

// Cập nhật thống kê khi danh sách rỗng
function updateSummaryOnly() {
  updateRemainingCount();
  updateTotalCost();
}

//Phần 8: Chuyển tab
function switchTab(tab) {
  currentTab = tab;
  const pageTitle = document.getElementById("page-title");
  const pageDescription = document.getElementById("page-description");
  const addForm = document.getElementById("add-form");
  const filters = document.getElementById("filters");
  const summary = document.getElementById("summary");

  // Xóa trạng thái active của các nút
  document.querySelectorAll(".main-nav button").forEach((button) => {
    button.classList.remove("active");
  });

  // Chuyển nội dung theo từng tab
  if (tab === "list") {
    document.getElementById("tab-list").classList.add("active");
    pageTitle.textContent = "Danh sách mua sắm";
    pageDescription.textContent = "Theo dõi những món bạn cần mua.";
    addForm.style.display = "";
    filters.style.display = "";
    summary.style.display = "";
    renderItems();
  } else if (tab === "done") {
    document.getElementById("tab-done").classList.add("active");
    pageTitle.textContent = "Các món đã mua";
    pageDescription.textContent = "Danh sách những món bạn đã hoàn thành.";
    addForm.style.display = "none";
    filters.style.display = "none";
    summary.style.display = "none";
    renderItems();
  } else if (tab === "guide") {
    document.getElementById("tab-guide").classList.add("active");
    pageTitle.textContent = "Hướng dẫn sử dụng";
    pageDescription.textContent = "Cách sử dụng ứng dụng MiniShopping.";
    addForm.style.display = "none";
    filters.style.display = "none";
    summary.style.display = "none";

    // Nội dung hướng dẫn
    itemList.innerHTML = `
            <div class="guide-content">
                <p>1. Nhập tên món và giá dự kiến.</p>
                <p>2. Nhấn nút Thêm món để thêm vào danh sách.</p>
                <p>3. Đánh dấu checkbox khi đã mua món hàng.</p>
                <p>4. Nhấn Xóa để xóa món khỏi danh sách.</p>
                <p>5. Sử dụng các nút lọc để xem danh sách.</p>
                <p>6. Tổng dự kiến chỉ tính các món chưa mua.</p>
            </div>
        `;
  }
}
// Nút Thêm món
document.getElementById("btn-add").addEventListener("click", addItem);

// Nhấn Enter trong ô tên món cũng thêm món
nameInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addItem();
  }
});

// Nhấn Enter trong ô giá cũng thêm món
priceInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addItem();
  }
});

// Nút lọc Tất cả
document.getElementById("filters-all").addEventListener("click", function () {
  filterItems("all");
});

// Nút lọc Chưa mua
document
  .getElementById("filters-pending")
  .addEventListener("click", function () {
    filterItems("pending");
  });

//Đã mua
document
  .getElementById("filters-completed")
  .addEventListener("click", function () {
    filterItems("completed");
  });

// Nút điều hướng Danh sách
document.getElementById("tab-list").addEventListener("click", function () {
  switchTab("list");
});

// Nút điều hướng Đã xong
document.getElementById("tab-done").addEventListener("click", function () {
  switchTab("done");
});

// Nút điều hướng Hướng dẫn
document.getElementById("tab-guide").addEventListener("click", function () {
  switchTab("guide");
});

// Logo MiniShopping quay về danh sách
document.querySelector(".brand").addEventListener("click", function () {
  switchTab("list");
});

// Hiển thị dữ liệu ban đầu
renderItems();
