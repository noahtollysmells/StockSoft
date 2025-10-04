let laptops = [];
let editingId = null;

const modal = document.getElementById('modal');
const barcodeModal = document.getElementById('barcodeModal');
const detailModal = document.getElementById('detailModal');
const addNewBtn = document.getElementById('addNewBtn');
const laptopForm = document.getElementById('laptopForm');
const inventoryBody = document.getElementById('inventoryBody');
const searchInput = document.getElementById('searchInput');
const emptyState = document.getElementById('emptyState');
const modalTitle = document.getElementById('modalTitle');
const cancelBtn = document.getElementById('cancelBtn');
const printBarcodeBtn = document.getElementById('printBarcodeBtn');

document.querySelectorAll('.close').forEach(btn => {
    btn.addEventListener('click', closeModals);
});

document.querySelectorAll('.barcode-close').forEach(btn => {
    btn.addEventListener('click', () => {
        barcodeModal.classList.remove('show');
    });
});

document.querySelectorAll('.detail-close').forEach(btn => {
    btn.addEventListener('click', () => {
        detailModal.classList.remove('show');
    });
});

window.addEventListener('click', (e) => {
    if (e.target === modal) closeModals();
    if (e.target === barcodeModal) barcodeModal.classList.remove('show');
    if (e.target === detailModal) detailModal.classList.remove('show');
});

addNewBtn.addEventListener('click', () => {
    editingId = null;
    modalTitle.textContent = 'Add New Laptop';
    laptopForm.reset();
    modal.classList.add('show');
});

cancelBtn.addEventListener('click', closeModals);

laptopForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveLaptop();
});

searchInput.addEventListener('input', (e) => {
    renderInventory(e.target.value);
});

printBarcodeBtn.addEventListener('click', () => {
    window.print();
});

function closeModals() {
    modal.classList.remove('show');
}

function generateId() {
    return 'LAP' + Date.now().toString().slice(-8);
}

function saveLaptop() {
    const laptop = {
        id: editingId || generateId(),
        brand: document.getElementById('brand').value,
        modelName: document.getElementById('modelName').value,
        specs: document.getElementById('specs').value,
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value)
    };

    if (editingId) {
        const index = laptops.findIndex(l => l.id === editingId);
        laptops[index] = laptop;
    } else {
        laptops.push(laptop);
    }

    saveToLocalStorage();
    renderInventory();
    closeModals();
    laptopForm.reset();
}

function editLaptop(id) {
    const laptop = laptops.find(l => l.id === id);
    if (!laptop) return;

    editingId = id;
    modalTitle.textContent = 'Edit Laptop';
    
    document.getElementById('brand').value = laptop.brand;
    document.getElementById('modelName').value = laptop.modelName;
    document.getElementById('specs').value = laptop.specs;
    document.getElementById('price').value = laptop.price;
    document.getElementById('stock').value = laptop.stock;
    
    modal.classList.add('show');
}

function deleteLaptop(id) {
    if (confirm('Are you sure you want to delete this laptop?')) {
        laptops = laptops.filter(l => l.id !== id);
        saveToLocalStorage();
        renderInventory();
    }
}

function showBarcode(id) {
    const laptop = laptops.find(l => l.id === id);
    if (!laptop) return;

    document.getElementById('barcodeLaptopName').textContent = laptop.modelName;
    document.getElementById('barcodeLaptopBrand').textContent = laptop.brand;
    document.getElementById('barcodeId').textContent = laptop.id;
    
    JsBarcode("#barcodeDisplay", laptop.id, {
        format: "CODE128",
        width: 2,
        height: 60,
        displayValue: true
    });
    
    barcodeModal.classList.add('show');
}

function showDetail(id) {
    const laptop = laptops.find(l => l.id === id);
    if (!laptop) return;

    const detailContent = document.getElementById('detailContent');
    detailContent.innerHTML = `
        <p><strong>ID:</strong> ${laptop.id}</p>
        <p><strong>Brand:</strong> ${laptop.brand}</p>
        <p><strong>Model:</strong> ${laptop.modelName}</p>
        <p><strong>Specifications:</strong> ${laptop.specs}</p>
        <p><strong>Price:</strong> $${laptop.price.toFixed(2)}</p>
        <p><strong>Stock:</strong> ${laptop.stock} units</p>
    `;
    
    detailModal.classList.add('show');
}

function getStockClass(stock) {
    if (stock === 0) return 'stock-out';
    if (stock <= 5) return 'stock-low';
    if (stock <= 15) return 'stock-medium';
    return 'stock-high';
}

function getStockText(stock) {
    if (stock === 0) return 'Out of Stock';
    return `${stock} units`;
}

function renderInventory(searchTerm = '') {
    const filtered = laptops.filter(laptop => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return laptop.brand.toLowerCase().includes(term) ||
               laptop.modelName.toLowerCase().includes(term) ||
               laptop.specs.toLowerCase().includes(term) ||
               laptop.id.toLowerCase().includes(term);
    });

    if (filtered.length === 0) {
        inventoryBody.innerHTML = '';
        emptyState.classList.add('show');
        return;
    }

    emptyState.classList.remove('show');

    inventoryBody.innerHTML = filtered.map(laptop => `
        <tr>
            <td><strong>${laptop.id}</strong></td>
            <td><span class="brand-badge brand-${laptop.brand.toLowerCase()}">${laptop.brand}</span></td>
            <td>${laptop.modelName}</td>
            <td>${laptop.specs}</td>
            <td>$${laptop.price.toFixed(2)}</td>
            <td><span class="stock-badge ${getStockClass(laptop.stock)}">${getStockText(laptop.stock)}</span></td>
            <td class="barcode-cell" onclick="showDetail('${laptop.id}')">
                <svg id="barcode-${laptop.id}"></svg>
            </td>
            <td>
                <button class="btn btn-small btn-barcode" onclick="showBarcode('${laptop.id}')">Print</button>
                <button class="btn btn-small btn-edit" onclick="editLaptop('${laptop.id}')">Edit</button>
                <button class="btn btn-small btn-delete" onclick="deleteLaptop('${laptop.id}')">Delete</button>
            </td>
        </tr>
    `).join('');

    filtered.forEach(laptop => {
        try {
            JsBarcode(`#barcode-${laptop.id}`, laptop.id, {
                format: "CODE128",
                width: 1,
                height: 40,
                displayValue: false,
                margin: 0
            });
        } catch (e) {
            console.error('Barcode generation error:', e);
        }
    });
}

function saveToLocalStorage() {
    localStorage.setItem('laptopInventory', JSON.stringify(laptops));
}

function loadFromLocalStorage() {
    const stored = localStorage.getItem('laptopInventory');
    if (stored) {
        laptops = JSON.parse(stored);
        renderInventory();
    } else {
        emptyState.classList.add('show');
    }
}

loadFromLocalStorage();
