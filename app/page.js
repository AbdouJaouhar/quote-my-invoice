"use client";
import { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function Home() {
  const [serviceRows, setServiceRows] = useState([{ description: "", quantity: 1, price: 0, priceType: "prix unitaire" }]);
  const [productRows, setProductRows] = useState([{ description: "", quantity: 1, price: 0, priceType: "prix unitaire" }]);
  const [selectedClient, setSelectedClient] = useState(""); 
  const [clientDetails, setClientDetails] = useState({ name: "", address: "", country: "" }); // Ajout de l'état pour les détails du client
  const [invoiceNumber, setInvoiceNumber] = useState(107); 
  const [useCustomDate, setUseCustomDate] = useState(false); 
  const [customDate, setCustomDate] = useState(new Date().toISOString().split("T")[0]); 

  const addServiceRow = () => {
    setServiceRows([...serviceRows, { description: "", quantity: 1, price: 0, priceType: "prix unitaire" }]);
  };

  const addProductRow = () => {
    setProductRows([...productRows, { description: "", quantity: 1, price: 0, priceType: "prix unitaire" }]);
  };

  const handleServiceChange = (index, field, value) => {
    const newRows = [...serviceRows];
    newRows[index][field] = value;
    setServiceRows(newRows);
  };

  const handleProductChange = (index, field, value) => {
    const newRows = [...productRows];
    newRows[index][field] = value;
    setProductRows(newRows);
  };

  const computeTotal = () => {
    const serviceTotal = serviceRows.reduce((total, row) => total + row.quantity * row.price, 0);
    const productTotal = productRows.reduce((total, row) => total + row.quantity * row.price, 0);
    return serviceTotal + productTotal;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const date = useCustomDate ? customDate : new Date().toISOString().split("T")[0];

    // Ajouter le logo et les informations de l'entreprise
    const logoUrl = 'kamed_nettoyage.png'; 
    const image = new Image();
    image.src = logoUrl;
    const imageWidth = image.width;
    const imageHeight = image.height;
    doc.addImage(logoUrl, 'PNG', 10, 10, imageWidth/5, imageHeight/5);
    
    doc.setFontSize(10);
    doc.text("Kamed", doc.internal.pageSize.width - 15, 15, { align: 'right' });
    doc.text("28 allée Gustave Flaubert", doc.internal.pageSize.width - 15, 20, { align: 'right' });
    doc.text("59200 Tourcoing", doc.internal.pageSize.width - 15, 25, { align: 'right' });
    doc.text("France", doc.internal.pageSize.width - 15, 30, { align: 'right' });

    // add a line to separate the header from the body
    doc.setDrawColor(81, 194, 140); 
    doc.line(10, 35, doc.internal.pageSize.width - 10, 35);
    doc.setDrawColor(0); 

    doc.setFontSize(18);
    doc.setTextColor(81, 194, 140); 
    doc.text("Devis n°" + invoiceNumber.toString().padStart(5, '0'), 15, 50);
    doc.setTextColor(0); 

    doc.setFontSize(10);
    doc.text(`Client: ${clientDetails.name}`, 15, 60);
    doc.text(`Adresse: ${clientDetails.address}`, 15, 65);
    doc.text(`Pays: ${clientDetails.country}`, 15, 70);
    doc.text(`Date de création: ${new Date(date).toLocaleDateString('fr-FR')}`, 15, 75); 

    const serviceTableColumn = ["Description", "Quantité", "Prix (€)", "Type de prix"];
    const serviceTableRows = [];
    serviceRows.forEach(row => {
      const rowData = [row.description, row.quantity, row.price, row.priceType];
      serviceTableRows.push(rowData);
    });
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text("Prestations", 14, 90);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);

    doc.autoTable(serviceTableColumn, serviceTableRows, { 
      startY: 90,
      margin: { top: 10 },
      headStyles: { fillColor: [81, 194, 140] } 
    });

    const productTableColumn = ["Description", "Quantité", "Prix (€)", "Type de prix"];
    const productTableRows = [];
    productRows.forEach(row => {
      const rowData = [row.description, row.quantity, row.price, row.priceType];
      productTableRows.push(rowData);
    });

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text("Produits/Location de matériel", 14, doc.autoTable.previous.finalY + 10);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);

    doc.autoTable(productTableColumn, productTableRows, { 
      startY: doc.autoTable.previous.finalY + 10,
      margin: { top: 10 },
      headStyles: { fillColor: [81, 194, 140] } 
    });

    const pageWidth = doc.internal.pageSize.width;
    const rectWidth = 180;
    const rectX = pageWidth - rectWidth - 15; 
    doc.rect(rectX, doc.autoTable.previous.finalY + 5, rectWidth, 10);
    
    const totalText = `Total: ${computeTotal().toFixed(2)} €`;
    doc.text(totalText, pageWidth - 20, doc.autoTable.previous.finalY + 12, { align: 'right' });

    doc.save("devis.pdf");
  };

  return (
    <main className="w-full p-24">
      <div className="mb-4 flex items-center justify-between mb-12">
        <h1 className="text-4xl font-bold text-[#51C28C]">Création d'un devis</h1>
        <div className="flex items-center">
          <label htmlFor="invoiceNumber" className="block font-bold mr-2">Numéro de devis:</label>
          <span className="text-[#51C28C] font-bold">#{invoiceNumber.toString().padStart(5, '0')}</span>
        </div>
      </div>
      <form className="min-w-full max-w-lg">
        <h1 className="text-2xl font-light mb-4 text-[#7AD3A9]">Informations du client</h1>
        {/* <div className="mb-4">
          <label htmlFor="client" className="block font-bold mb-2">Client:</label>
          <select
            id="client"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="p-2 border border-gray-300 rounded text-black w-full"
          >
            <option value="">Sélectionner un client</option>
            <option value="Client 1">Client 1</option>
            <option value="Client 2">Client 2</option>
            <option value="Client 3">Client 3</option>
          </select>
        </div> */}
        <div className="mb-4">
          <label htmlFor="clientName" className="block font-bold mb-2">Nom du client:</label>
          <input
            type="text"
            id="clientName"
            value={clientDetails.name}
            onChange={(e) => handleClientDetailsChange("name", e.target.value)}
            className="p-2 border border-gray-300 rounded text-black w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="clientAddress" className="block font-bold mb-2">Adresse:</label>
          <input
            type="text"
            id="clientAddress"
            value={clientDetails.address}
            onChange={(e) => handleClientDetailsChange("address", e.target.value)}
            className="p-2 border border-gray-300 rounded text-black w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="clientCountry" className="block font-bold mb-2">Pays:</label>
          <select
            id="clientCountry"
            value={clientDetails.country}
            onChange={(e) => handleClientDetailsChange("country", e.target.value)}
            className="p-2 border border-gray-300 rounded text-black w-full"
          >
            <option value="France">France</option>
            <option value="Belgique">Belgique</option>
          </select>
        </div>
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <label htmlFor="currentDate" className="block font-bold mb-2">
              Date actuelle:
            </label>
            <div>
              {useCustomDate ? new Date(customDate).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR')}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="useCustomDate"
              checked={useCustomDate}
              onChange={(e) => setUseCustomDate(e.target.checked)}
              className="leading-tight"
            />
            <label htmlFor="useCustomDate" className="font-bold mr-2">Utiliser une date personnalisée:</label>
          </div>
          {useCustomDate && (
            <>
            <input
              type="text"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              onClick={() => document.getElementById('datePicker').showPicker()}
              className="p-2 border border-gray-300 rounded text-black w-full mt-2 cursor-pointer"
              readOnly
            />
            <input
              type="date"
              id="datePicker"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
                className="hidden"
              />
            </>
          )}
        </div>
        <h2 className="text-2xl font-light mb-4 text-[#7AD3A9] mt-8">Prestations</h2>
      {serviceRows.map((row, index) => (
        <div key={index} className="mb-8 p-4 bg-[#51C28C] rounded-md shadow">
          <h3 className="text-lg font-bold mb-4">Ligne {index + 1}</h3>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label htmlFor={`service-description-${index}`} className="block font-bold mb-2">Description:</label>
              <textarea
                id={`service-description-${index}`}
                value={row.description}
                onChange={(e) => handleServiceChange(index, "description", e.target.value)}
                className="p-2 border border-gray-300 rounded text-black w-full"
                rows="3"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor={`service-quantity-${index}`} className="block font-bold mb-2">Quantité:</label>
              <input
                type="number"
                id={`service-quantity-${index}`}
                value={row.quantity}
                onChange={(e) => handleServiceChange(index, "quantity", e.target.value)}
                className="p-2 border border-gray-300 rounded text-black w-full"
              />
            </div>
            <div>
              <label htmlFor={`service-price-${index}`} className="block font-bold mb-2">Prix:</label>
              <input
                type="number"
                id={`service-price-${index}`}
                value={row.price}
                onChange={(e) => handleServiceChange(index, "price", e.target.value)}
                className="p-2 border border-gray-300 rounded text-black w-full"
              />
            </div>
            <div>
              <label htmlFor={`service-priceType-${index}`} className="block font-bold mb-2">Type de prix:</label>
              <select
                id={`service-priceType-${index}`}
                value={row.priceType}
                onChange={(e) => handleServiceChange(index, "priceType", e.target.value)}
                className="p-2 border border-gray-300 rounded text-black w-full"
              >
                <option value="prix unitaire">Prix unitaire</option>
                <option value="prix total">Prix total</option>
              </select>
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <button type="button" onClick={addServiceRow} className="bg-blue-500 text-white p-2 rounded">Ajouter une prestation</button>
      </div>
      <h2 className="text-2xl font-light mb-4 text-[#7AD3A9] mt-8">Produits/Location de matériel</h2>
      {productRows.map((row, index) => (
        <div key={index} className="mb-8 p-4 bg-[#51C28C] rounded-md shadow">
        <h3 className="text-lg font-bold mb-4">Ligne {index + 1}</h3>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label htmlFor={`service-description-${index}`} className="block font-bold mb-2">Description:</label>
            <textarea
              id={`service-description-${index}`}
              value={row.description}
              onChange={(e) => handleProductChange(index, "description", e.target.value)}
              className="p-2 border border-gray-300 rounded text-black w-full"
              rows="3"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`service-quantity-${index}`} className="block font-bold mb-2">Quantité:</label>
            <input
              type="number"
              id={`service-quantity-${index}`}
              value={row.quantity}
              onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
              className="p-2 border border-gray-300 rounded text-black w-full"
            />
          </div>
          <div>
            <label htmlFor={`service-price-${index}`} className="block font-bold mb-2">Prix:</label>
            <input
              type="number"
              id={`service-price-${index}`}
              value={row.price}
              onChange={(e) => handleProductChange(index, "price", e.target.value)}
              className="p-2 border border-gray-300 rounded text-black w-full"
            />
          </div>
          <div>
            <label htmlFor={`service-priceType-${index}`} className="block font-bold mb-2">Type de prix:</label>
            <select
              id={`service-priceType-${index}`}
              value={row.priceType}
              onChange={(e) => handleProductChange(index, "priceType", e.target.value)}
              className="p-2 border border-gray-300 rounded text-black w-full"
            >
              <option value="prix unitaire">Prix unitaire</option>
              <option value="prix total">Prix total</option>
            </select>
          </div>
        </div>
      </div>
      ))}
      <button type="button" onClick={addProductRow} className="bg-blue-500 text-white p-2 rounded float-right">Ajouter un produit</button>
      </form>
      <button type="button" onClick={generatePDF} className="bg-green-500 text-white p-2 rounded ml-2 w-full my-4 py-4">Générer le devis PDF</button>
    </main>
  );
}