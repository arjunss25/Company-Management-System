import {
  IoChevronDownOutline,
  IoSearchOutline,
  IoCloseOutline,
  IoCloudUploadOutline,
  IoCheckmarkCircleOutline,
  IoDocumentOutline,
} from 'react-icons/io5';
import ProductDetails from './ProductDetails';
import React, { useEffect, useState } from 'react';
import TermsAndConditions from './TermsAndConditions';
import ClientModal from './ClientModal';
import LocationModal from './LocationModal';
import SiteInChargeModal from './SiteInChargeModal';
import AddStaffModal from '../../../Common/AddStaffModal';

// api imports
import {
  generateQuotationNumber,
  getSalesPersons,
  generateJobNumber,
  getClients,getLocations,getAttentionsApplicable,getStaffList,addQuotationWorkDetails,
} from '../../../../Services/QuotationApi';



const WorkDetails = () => {
  const [formData, setFormData] = useState({
    quotationNo: '',
    date: new Date().toISOString().split('T')[0],
    projectManager: '',
    pmName: '',
    jobNo: '',
    rfqNo: '',
    projectStatus: '',
    client: '',
    location: '',
    attention: 'Not Applicable',
    attentionTo: '',
    attentionSearch: '',
    subject: '',
    quotationStatus: 'Pending',
    unit: '',
    unitType: '',
    unitDetails: [],
    clientSearch: '',
    locationSearch: '',
    expectedMaterialCost: '',
    expectedLabourCost: '',
    siteInCharge: '',
    scheduledHandOverDate: '',
    lpoNumber: '',
    lpoStatus: '',
    prNo: '',
    wcrStatus: '',
    invoice: '',
    invoiceStatus: '',
    lpoDetails: [
      { lpoStatus: '', prNo: '', date: '', lpoNo: '', lpoAmount: '' },
    ],


    lpoDate: '',
    wcrAttachment: null,
    invoiceDetails: [
      {
        invoiceStatus: '',
        invoiceNo: '',
        invoiceDate: '',
        invoiceAmount: '',
        grnStatus: 'Pending',
        retention: 'Not Applicable',
        dueAfter: '',
        dueDate: '',
        retentionInvoice: 'Pending',
        retentionAmount: '',
      },
    ],
    buildingNo: '',
    phase: '',
    apNo: '',
    flatType: '',
    communityCenterNo: '',
    communityCenterType: '',
    lcNo: '',
    lcLocation: '',
    roomNo: '',
    mallNo: '',
    mallType: '',
    swimmingPoolNo: '',
  });

  const [isAttentionDropdownOpen, setIsAttentionDropdownOpen] = useState(false);
  const [isPmDropdownOpen, setIsPmDropdownOpen] = useState(false);
  const [pmSearch, setPmSearch] = useState('');
  const [openSelect, setOpenSelect] = useState(null);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [attentionSearch, setAttentionSearch] = useState('');
  const [showProducts, setShowProducts] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pmNames, setPmNames] = useState([]);
  const [pmLoading, setPmLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [locations, setLocations] = useState([]);
const [locationSearch, setLocationSearch] = useState('');
const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
const [attentionsList, setAttentionsList] = useState([]);
const [staffList, setStaffList] = useState([]);
const [isSiteInChargeDropdownOpen, setIsSiteInChargeDropdownOpen] = useState(false);
const [siteInChargeSearch, setSiteInChargeSearch] = useState('');
const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'invoiceStatus' && {
        invoiceDetails: prev.invoiceDetails.map(detail => ({
          ...detail,
          invoiceStatus: value
        }))
      })
    }));
  };

  const handleSelectClick = (selectName) => {
    setOpenSelect(openSelect === selectName ? null : selectName);
  };
  
  const handleAddLPO = () => {
    setFormData((prev) => ({
      ...prev,
      lpoDetails: [
        ...prev.lpoDetails,
        { lpoStatus: '', prNo: '', date: '', lpoNo: '', lpoAmount: '' },
      ],
    }));
  };

  const handleRemoveLPO = (index) => {
    setFormData((prev) => ({
      ...prev,
      lpoDetails: prev.lpoDetails.filter((_, i) => i !== index),
    }));
  };

  const handleLPODetailChange = (index, field, value) => {
    if (formData.lpoNumber === 'Single') {
      // For single LPO, update both the main form and the LPO details
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        lpoDetails: [{
          ...prev.lpoDetails[0],
          [field]: value
        }]
      }));
    } else {
      // For partial LPO, update only the LPO details array
      setFormData((prev) => ({
        ...prev,
        lpoDetails: prev.lpoDetails.map((detail, i) =>
          i === index ? { ...detail, [field]: value } : detail
        )
      }));
    }
  };

  const handleAddInvoice = () => {
    setFormData((prev) => ({
      ...prev,
      invoiceDetails: [
        ...prev.invoiceDetails,
        {
          invoiceStatus: '',
          invoiceNo: '',
          invoiceDate: '',
          invoiceAmount: '',
          grnStatus: 'Pending',
          retention: 'Not Applicable',
          dueAfter: '',
          dueDate: '',
          retentionInvoice: 'Pending',
          retentionAmount: '',
        },
      ],
    }));
  };

  const handleRemoveInvoice = (index) => {
    setFormData((prev) => ({
      ...prev,
      invoiceDetails: prev.invoiceDetails.filter((_, i) => i !== index),
    }));
  };

  const handleInvoiceDetailChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      invoiceDetails: prev.invoiceDetails.map((detail, i) =>
        i === index ? { ...detail, [field]: value } : detail
      ),
    }));
  };

  const handleAddUnitType = () => {
    setFormData((prev) => ({
      ...prev,
      unitDetails: [...prev.unitDetails, { type: '' }],
    }));
  };

  const handleRemoveUnitType = (index) => {
    setFormData((prev) => ({
      ...prev,
      unitDetails: prev.unitDetails.filter((_, i) => i !== index),
    }));
  };

  const handleUnitTypeChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      unitDetails: prev.unitDetails.map((detail, i) =>
        i === index ? { ...detail, type: value } : detail
      ),
    }));
  };

  const handleUnitTypeDetailChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      unitDetails: prev.unitDetails.map((detail, i) =>
        i === index ? { ...detail, [field]: value } : detail
      ),
    }));
  };
  const handleAddNewClient = (newClient) => {
    // Update clients list
    setClients(prevClients => [...prevClients, newClient]);
    
    // Update the selected client in the form
    setFormData(prev => ({
      ...prev,
      // client: newClient.id,
      clientName: newClient.clientName
    }));
  };
  const handleAddNewLocation = (newLocation) => {
    // Update locations list
    setLocations(prevLocations => [...prevLocations, newLocation]);
    
    // Update the selected location in the form
    setFormData(prev => ({
      ...prev,
      location: newLocation.locationName
    }));
  };
  
  const handleAddNewStaff = (newStaff) => {
    // Update staff list
    setPmNames(prevStaff => [...prevStaff, newStaff]);
    
    // Update the selected staff in the form if needed
    setFormData(prev => ({
      ...prev,
      projectManager: newStaff.id,
      pmName: newStaff.staffName
    }));
  };``








  const handleSaveAndContinue = async () => {
    try {
      // Debugging: Log the formData state before any processing
      console.log("Initial formData:", formData);
  
      // Format unit details
      const formattedUnits = formData.unit === 'Single' 
        ? [{
            unit_type: formData.unitType,
            start_date: formData.unitDetails[0]?.startDate || formData.date,
            end_date: formData.unitDetails[0]?.endDate || formData.date,
            work_status: formData.unitDetails[0]?.workStatus || "Not Started",
            // Add type-specific fields
            ...(formData.unitType === 'Apartment' && {
              building_no: formData.unitDetails[0]?.buildingNo || '',
              phase: formData.unitDetails[0]?.phase || '',
              ap_no: formData.unitDetails[0]?.apNo || '',
              flat_type: formData.unitDetails[0]?.flatType || ''
            }),
            ...(formData.unitType === 'Building' && {
              building_number: formData.unitDetails[0]?.buildingNo || ''
            }),
            ...(formData.unitType === 'Community Center' && {
              communitycenter_no: formData.unitDetails[0]?.communityCenterNo || '',
              community_center_type: formData.unitDetails[0]?.communityCenterType || ''
            }),
            ...(formData.unitType === 'Labour Camp' && {
              lc_no: formData.unitDetails[0]?.lcNo || '',
              lc_location: formData.unitDetails[0]?.lcLocation || '',
              room_no: formData.unitDetails[0]?.roomNo || ''
            }),
            ...(formData.unitType === 'Mall' && {
              mall_no: formData.unitDetails[0]?.mallNo || '',
              type: formData.unitDetails[0]?.mallType || ''
            }),
            ...(formData.unitType === 'Swimming Pool' && {
              pool_no: formData.unitDetails[0]?.swimmingPoolNo || ''
            }),
            ...(formData.unitType === 'Villa' && {
              villa_no: formData.unitDetails[0]?.villaNo || '',
              villa_type: formData.unitDetails[0]?.villaType || ''
            }),
            ...(formData.unitType === 'Warehouse' && {
              warehouse_no: formData.unitDetails[0]?.warehouseNo || '',
              warehouse_location: formData.unitDetails[0]?.warehouseLocation || ''
            }),
            ...(formData.unitType === 'Toilet' && {
              toilet_no: formData.unitDetails[0]?.toiletNo || '',
              toilet_type: formData.unitDetails[0]?.toiletType || ''
            }),
            ...(formData.unitType === 'Other' && {
              reference_no: formData.unitDetails[0]?.referenceNo || '',
              description: formData.unitDetails[0]?.description || ''
            })
          }]
        : formData.unitDetails.map(detail => ({
          unit_type: detail.type,
            start_date: detail.startDate || formData.date,
            end_date: detail.endDate || formData.date,
            work_status: detail.workStatus || "Not Started",
            // Add type-specific fields based on unit type
            ...(detail.type === 'Apartment' && {
              building_no: detail.buildingNo || '',
              phase: detail.phase || '',
              ap_no: detail.apNo || '',
              flat_type: detail.flatType || ''
            }),
            ...(detail.type === 'Building' && {
              building_number: detail.buildingNo || ''
            }),
            ...(detail.type === 'Community Center' && {
              communitycenter_no: detail.communityCenterNo || '',
              community_center_type: detail.communityCenterType || ''
            }),
            ...(detail.type === 'Labour Camp' && {
              lc_no: detail.lcNo || '',
              lc_location: detail.lcLocation || '',
              room_no: detail.roomNo || ''
            }),
            ...(detail.type === 'Mall' && {
              mall_no: detail.mallNo || '',
              type: detail.mallType || ''
            }),
            ...(detail.type === 'Swimming Pool' && {
              swimming_pool_no: detail.swimmingPoolNo || ''
            }),
            ...(detail.type === 'Villa' && {
              villa_no: detail.villaNo || '',
              villa_type: detail.villaType || ''
            }),
            ...(detail.type === 'Warehouse' && {
              warehouse_no: detail.warehouseNo || '',
              warehouse_location: detail.warehouseLocation || ''
            }),
            ...(detail.type === 'Toilet' && {
              toilet_no: detail.toiletNo || '',
              toilet_type: detail.toiletType || ''
            }),
            ...(detail.type === 'Other' && {
              reference_no: detail.referenceNo || '',
              description: detail.description || ''
            })
          }));
  
      // Debugging: Log the formatted units
      console.log("Formatted Units:", formattedUnits);
  
      // Format LPO details
      const formattedLPO = formData.lpoNumber === 'Single' 
        ? [{
            lpo_status: formData.lpoStatus || "Pending",
            pr_no: formData.prNo || '', 
            lpo_no: formData.lpoNo || '', 
            lpo_amount: Number(formData.lpoAmount) || 0,
            lpo_date: formatDate(formData.lpoDate) || formatDate(formData.date),
          }]
        : formData.lpoDetails.map((lpo) => ({
            lpo_status: lpo.lpoStatus || "Pending",
            pr_no: lpo.prNo || '',
            lpo_no: lpo.lpoNo || '',
            lpo_amount: Number(lpo.lpoAmount) || 0,
            lpo_date: formatDate(lpo.date) || formatDate(formData.date),
          }));
  
      // Debugging: Log the formatted LPO details
      console.log("Formatted LPO:", formattedLPO);
  
      // Format invoice details
      const formattedInvoices = formData.invoiceDetails.map((invoice) => ({
        invoice_status: formData.invoiceStatus || "Pending", // Changed from invoice.invoiceStatus to formData.invoiceStatus
        invoice_no: invoice.invoiceNo || "",
        invoice_date: invoice.invoiceDate || formData.date,
        invoice_amount: Number(invoice.invoiceAmount) || 0,
        grn_status: invoice.grnStatus || "Pending",
        grn_no: invoice.grnNo || "",
        grn_date: invoice.grnDate || formData.date,
        retention: invoice.retention || "Not Applicable",
        retention_amount: Number(invoice.retentionAmount) || 0,
        due_after: invoice.dueAfter || "",
        due_date: invoice.dueDate || formData.date,
        retention_invoice: invoice.retentionInvoice || "Pending",
        retention_invoice_date: invoice.retentionInvoiceDate || formData.date,
        retention_invoice_no: invoice.retentionInvoiceNo || "",
        retention_invoice_amount: Number(invoice.retentionInvoiceAmount) || 0,
      }));
  
      // Debugging: Log the formatted invoices
      console.log("Formatted Invoices:", formattedInvoices);
    
      // Prepare the final payload
      const payload = {
        quotation_no: formData.quotationNo,
        date: formatDate(formData.date),
        project_manager: formData.projectManager,
        attention: formData.attention,
        attention_to: formData.attentionTo || "",
        client: formData.client,
        expected_labour_cost: Number(formData.expectedLabourCost) || 0,
        expected_material_cost: Number(formData.expectedMaterialCost) || 0,
        invoice: formData.invoice,
        invoice_status: formData.invoiceStatus || "Pending",
        invoices: formattedInvoices,
        job_no: formData.jobNo,
        location: formData.location,
        lpo: formattedLPO,
        lpo_number: formData.lpoNumber,
        option: option,
        pm_name: formData.pmName,
        project_status: formData.projectStatus || "Active",
        quotation_status: formData.quotationStatus,
        rfq_no: formData.rfqNo,
        scheduled_hand_over_date: formData.scheduledHandOverDate || formData.date,
        site_in_charge: formData.siteInCharge,
        subject: formData.subject,
        unit_option: formData.unit,
        units: formattedUnits,
        wcr_status: formData.wcrStatus || "Pending",
      };
  
      // Debugging: Log the final payload before sending to the API
      console.log("Final Payload:", payload);
  
      // Call the API
      const response = await addQuotationWorkDetails(payload);
  
      // Debugging: Log the API response
      console.log("API Response:", response);
  
      if (response && response.status === 'Success') { // Adjust the condition based on your API response structure
        
        setShowProducts(true); // Show the ProductDetails component
      }
  
    } catch (error) {
      // Debugging: Log any errors
      console.error('Error saving work details:', error);
      toast.error(error.response?.data?.message || 'Error saving work details');
      setShowProducts(false);
    }

    
  };

  // date functionality in gnr
  const calculateDueDate = (grnDate, dueAfter) => {
    if (!grnDate) return '';

    const date = new Date(grnDate);

    switch (dueAfter) {
      case '1 Year':
        date.setFullYear(date.getFullYear() + 1);
        break;
      case '2 Years':
        date.setFullYear(date.getFullYear() + 2);
        break;
      case '3 Years':
        date.setFullYear(date.getFullYear() + 3);
        break;
      default:
        return '';
    }

    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  };

  // Modify the handleInvoiceDetailChange function
  const handleInvoiceDateChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedDetails = [...prev.invoiceDetails];
      updatedDetails[index] = {
        ...updatedDetails[index],
        [field]: value,
      };

      // If GRN date or Due After changes, update the Due Date
      if (field === 'grnDate' || field === 'dueAfter') {
        const grnDate =
          field === 'grnDate' ? value : updatedDetails[index].grnDate;
        const dueAfter =
          field === 'dueAfter' ? value : updatedDetails[index].dueAfter;

        if (grnDate && dueAfter) {
          updatedDetails[index].dueDate = calculateDueDate(grnDate, dueAfter);
        }
      }

      return {
        ...prev,
        invoiceDetails: updatedDetails,
      };
    });
  };

  const [option, setOption] = useState('Not Applicable');

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSiteInChargeModalOpen, setIsSiteInChargeModalOpen] = useState(false);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);

  // api -integration

  // quotation number
  useEffect(() => {
    const fetchQuotationNumber = async () => {
      try {
        const data = await generateQuotationNumber();
        setFormData((prev) => ({
          ...prev,
          quotationNo: data || '',
        }));
      } catch (error) {
        console.error('Failed to fetch quotation number:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuotationNumber();
  }, []);

  // pmnames
  useEffect(() => {
    const fetchPMNames = async () => {
      if (formData.projectManager === 'Applicable') {
        setPmLoading(true);
        try {
          const data = await getSalesPersons();
          setPmNames(data);
        } catch (error) {
          console.error('Failed to fetch PM names:', error);
        } finally {
          setPmLoading(false);
        }
      }
    };

    fetchPMNames();
  }, [formData.projectManager]);

  const filteredPmNames = pmNames.filter((pm) =>
    pm.staff_name.toLowerCase().includes(pmSearch.toLowerCase())
  );

  // fetch client
  useEffect(() => {
    const fetchClients = async () => {
      setClientsLoading(true);
      try {
        const data = await getClients();
        setClients(data || []);
      } catch (error) {
        console.error('Failed to fetch clients:', error);
      } finally {
        setClientsLoading(false);
      }
    };

    fetchClients();
  }, []);
  const filteredClientNames = clients.filter((client) =>
    client.clientName.toLowerCase().includes(clientSearch.toLowerCase())
  );

  // fetch location
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLocations();
        setLocations(data || []);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      }
    };
  
    fetchLocations();
  }, []);

// site in charge fetch
  useEffect(() => {
    const fetchStaffList = async () => {
      try {
        const data = await getStaffList();
        setStaffList(data || []);
      } catch (error) {
        console.error('Failed to fetch staff list:', error);
      }
    };
  
    fetchStaffList();
  }, []);

  const handleLPOChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset related fields when lpoNumber changes
      ...(name === 'lpoNumber' && {
        lpoStatus: '',
        prNo: '',
        lpoNo: '',
        lpoAmount: '',
        lpoDate: '',
      }),
      // Update lpoDetails array for Single LPO
      ...(prev.lpoNumber === 'Single' && {
        lpoDetails: [{
          ...prev.lpoDetails[0],
          lpoStatus: name === 'lpoStatus' ? value : prev.lpoStatus,
          prNo: name === 'prNo' ? value : prev.prNo,
          lpoNo: name === 'lpoNo' ? value : prev.lpoNo,
          lpoAmount: name === 'lpoAmount' ? value : prev.lpoAmount,
          date: name === 'lpoDate' ? value : prev.lpoDate,
        }]
      })
    }));
  };









  return (
    <div className="space-y-6 p-5 md:p-10">
      {/* First Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quotation No */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 h-5 block">
            Quotation No :
          </label>
          <input
            type="text"
            name="quotationNo"
            value={isLoading ? 'Loading...' : formData.quotationNo}
            disabled
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 h-5 block">
            Date :
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        {/* Project Manager */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 h-5 block">
            Project Manager <span className="text-red-500 ml-1">*</span> :
          </label>
          <div className="relative">
            <select
              name="projectManager"
              value={formData.projectManager}
              onChange={handleInputChange}
              onClick={() => handleSelectClick('projectManager')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
            >
              <option value="">Select</option>
              <option value="Applicable">Applicable</option>
              <option value="Not Applicable">Not Applicable</option>
            </select>
            <IoChevronDownOutline
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none transition-transform duration-300 ${
                openSelect === 'projectManager' ? 'rotate-180' : ''
              }`}
              size={20}
            />
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PM Name with Search Input */}
        {formData.projectManager === 'Applicable' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 h-5 block">
              PM Name <span className="text-red-500 ml-1">*</span> :
            </label>
            <div className="sec flex gap-2">
              <div className="relative flex-1">
                <div
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white cursor-pointer"
                  onClick={() => {
                    setIsPmDropdownOpen(!isPmDropdownOpen);
                    handleSelectClick('pmName');
                  }}
                >
                  {formData.pmName || 'Select PM'}
                </div>
                <IoChevronDownOutline
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none transition-transform duration-300 ${
                    openSelect === 'pmName' ? 'rotate-180' : ''
                  }`}
                  size={20}
                />

                {isPmDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <div className="p-2 border-b">
                      <input
                        type="text"
                        placeholder="Search PM..."
                        value={pmSearch}
                        onChange={(e) => setPmSearch(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {filteredPmNames.map((pm) => (
                        <div
                          key={pm.id}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={async () => {
                            setFormData((prev) => ({
                              ...prev,
                              pmName: pm.staff_name,
                            }));
                            setIsPmDropdownOpen(false);
                            setPmSearch('');

                            // job number generation
                            try {
                              const jobNo = await generateJobNumber(pm.id);
                              setFormData((prev) => ({
                                ...prev,
                                jobNo: jobNo || '',
                              }));
                            } catch (error) {
                              console.error(
                                'Failed to generate job number:',
                                error
                              );
                            }
                          }}
                        >
                          {pm.staff_name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsStaffModalOpen(true)}
                className="px-4 py-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors whitespace-nowrap"
              >
                New
              </button>
              <AddStaffModal
  isOpen={isStaffModalOpen}
  onClose={() => setIsStaffModalOpen(false)}
  handleAddStaff={handleAddNewStaff}
/>
            </div>
          </div>
        )}

        {/* Job No */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 h-5 block">
            Job No :
          </label>
          <input
            type="text"
            name="jobNo"
            value={formData.jobNo}
            disabled
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* RFQ No */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 h-5 block">
            RFQ No <span className="text-red-500 ml-1">*</span> :
          </label>
          <input
            type="text"
            name="rfqNo"
            value={formData.rfqNo}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Project Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            Project Status <span className="text-red-500 ml-1">*</span> :
          </label>
          <div className="relative">
            <select
              name="projectStatus"
              value={formData.projectStatus}
              onChange={handleInputChange}
              onClick={() => handleSelectClick('projectStatus')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
            >
              <option value="">Select</option>
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </select>
            <IoChevronDownOutline
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none transition-transform duration-300 ${
                openSelect === 'projectStatus' ? 'rotate-180' : ''
              }`}
              size={20}
            />
          </div>
        </div>

        {/* Client */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 h-5 block">
            Client <span className="text-red-500 ml-1">*</span> :
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white cursor-pointer"
                onClick={() => {
                  setIsClientDropdownOpen(!isClientDropdownOpen);
                  handleSelectClick('client');
                }}
              >
                {formData.client || 'Select Client'}
              </div>
              <IoChevronDownOutline
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none transition-transform duration-300 ${
                  openSelect === 'client' ? 'rotate-180' : ''
                }`}
                size={20}
              />

              {isClientDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  <div className="p-2 border-b">
                    <input
                      type="text"
                      placeholder="Search Client..."
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {clientsLoading ? (
                      <div className="px-3 py-2 text-gray-500">Loading...</div>
                    ) : (
                      filteredClientNames.map((client) => (
                        <div
  key={client.id}
  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
  onClick={async () => {
    setFormData((prev) => ({
      ...prev,
      client: client.clientName,
      clientId: client.id,
      attentionTo: '' 
    }));
    setIsClientDropdownOpen(false);
    setClientSearch('');
    
    // Fetch attentions 
    try {
      const attentionsData = await getAttentionsApplicable(client.id);
      setAttentionsList(attentionsData || []);
    } catch (error) {
      console.error('Failed to fetch attentions:', error);
    }
  }}
>
  {client.clientName}
</div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsClientModalOpen(true)}
              className="px-4 py-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors whitespace-nowrap"
            >
              New
            </button>
          </div>
          {/* Add the ClientModal component */}
          <ClientModal
      isOpen={isClientModalOpen}
      onClose={() => setIsClientModalOpen(false)}
      handleAddClient={handleAddNewClient}
      companyId={formData.companyId}
    />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 h-5 block">
            Location <span className="text-red-500 ml-1">*</span> :
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white cursor-pointer"
                onClick={() => {
                  setIsLocationDropdownOpen(!isLocationDropdownOpen);
                  handleSelectClick('location');
                }}
              >
                {formData.location || 'Select Location'}
              </div>
              <IoChevronDownOutline
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none transition-transform duration-300 ${
                  openSelect === 'location' ? 'rotate-180' : ''
                }`}
                size={20}
              />

             
    {isLocationDropdownOpen && (
      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
        <div className="p-2 border-b">
          <input
            type="text"
            placeholder="Search Location..."
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div className="max-h-48 overflow-y-auto">
          {locations
            .filter((loc) =>
              loc.location_name.toLowerCase().includes(locationSearch.toLowerCase())
            )
            .map((location) => (
              <div
                key={location.id}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    location: location.location_name,
                    locationId: location.id
                  }));
                  setIsLocationDropdownOpen(false);
                  setLocationSearch('');
                }}
              >
                {location.location_name}
              </div>
            ))}
        </div>
      </div>
    )}
            </div>
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="px-4 py-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors whitespace-nowrap"
            >
              New
            </button>

            <LocationModal
  isOpen={isLocationModalOpen}
  onClose={() => setIsLocationModalOpen(false)}
  handleAddLocation={handleAddNewLocation}
/>
          </div>
        </div>
      </div>

      {/* Fourth Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attention */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 h-5 block">
            Attention <span className="text-red-500 ml-0.5">*</span> :
          </label>
          <div className="relative">
            <select
              name="attention"
              value={formData.attention}
              onChange={handleInputChange}
              onClick={() => handleSelectClick('attention')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
            >
              <option value="Applicable">Applicable</option>
              <option value="Not Applicable">Not Applicable</option>
            </select>
            <IoChevronDownOutline
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none transition-transform duration-300 ${
                openSelect === 'attention' ? 'rotate-180' : ''
              }`}
              size={20}
            />
          </div>
        </div>

        {/* Attention To */}
        {formData.attention === 'Applicable' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 h-5 block">
              Attention To <span className="text-red-500 ml-1">*</span> :
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white cursor-pointer"
                  onClick={() => {
                    setIsAttentionDropdownOpen(!isAttentionDropdownOpen);
                    handleSelectClick('attentionTo');
                  }}
                >
                  {formData.attentionTo || 'Select Contact Person'}
                </div>
                <IoChevronDownOutline
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none transition-transform duration-300 ${
                    openSelect === 'attentionTo' ? 'rotate-180' : ''
                  }`}
                  size={20}
                />

{isAttentionDropdownOpen && (
  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
    <div className="p-2 border-b">
      <input
        type="text"
        placeholder="Search Contact Person..."
        value={attentionSearch}
        onChange={(e) => setAttentionSearch(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
    <div className="max-h-48 overflow-y-auto">
      {attentionsList
        .filter((attention) =>
          attention.name.toLowerCase().includes(attentionSearch.toLowerCase())
        )
        .map((attention) => (
          <div
            key={attention.id}
            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                attentionTo: attention.name,
                attentionToId: attention.id
              }));
              setIsAttentionDropdownOpen(false);
              setAttentionSearch('');
            }}
          >
            {attention.name}
          </div>
        ))}
    </div>
  </div>
)}
              </div>
              {/* <button
                type="button"
                className="px-4 py-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors whitespace-nowrap"
              >
                New
              </button> */}
            </div>
          </div>
        )}
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 h-5 block">
          Subject <span className="text-red-500 ml-1">*</span> :
        </label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      {/* Status and Option Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 border-b pb-6">
        {/* Quotation Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 h-5 block">
            Quotation Status:
          </label>
          <div className="relative">
            <select
              name="quotationStatus"
              value={formData.quotationStatus}
              onChange={handleInputChange}
              onClick={() => handleSelectClick('quotationStatus')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Approval Pending but Work Started on Urgent basis">
                Approval Pending but Work Started on Urgent basis
              </option>
            </select>
            <IoChevronDownOutline
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              size={20}
            />
          </div>
        </div>

        {/* Option */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 h-5 block">
            Option:
          </label>
          <div className="relative">
            <select
              name="option"
              value={option}
              onChange={(e) => setOption(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
            >
              <option value="Not Applicable">Not Applicable</option>
              <option value="Applicable">Applicable</option>
            </select>
            <IoChevronDownOutline
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              size={20}
            />
          </div>
        </div>
      </div>

      {(formData.quotationStatus === 'Approved' ||
        formData.quotationStatus ===
          'Approval Pending but Work Started on Urgent basis') && (
        <>
          {/* Expected Costs and Site In Charge Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 border-b pb-6">
            {/* Expected Material Cost */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 h-5 block">
                Expected Material Cost:
              </label>
              <input
                type="number"
                name="expectedMaterialCost"
                value={formData.expectedMaterialCost}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            {/* Expected Labour Cost */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 h-5 block">
                Expected Labour Cost:
              </label>
              <input
                type="number"
                name="expectedLabourCost"
                value={formData.expectedLabourCost}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            {/* Site In Charge with New Button */}
            <div className="space-y-2">
  <label className="text-sm font-medium text-gray-700 h-5 block">
    Site In Charge <span className="text-red-500 ml-1">*</span> :
  </label>
  <div className="flex gap-2">
    <div className="relative flex-1">
      <div
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white cursor-pointer"
        onClick={() => {
          setIsSiteInChargeDropdownOpen(!isSiteInChargeDropdownOpen);
          handleSelectClick('siteInCharge');
        }}
      >
        {formData.siteInCharge || 'Select Site In Charge'}
      </div>
      <IoChevronDownOutline
        className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none transition-transform duration-300 ${
          openSelect === 'siteInCharge' ? 'rotate-180' : ''
        }`}
        size={20}
      />

      {isSiteInChargeDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Search Site In Charge..."
              value={siteInChargeSearch}
              onChange={(e) => setSiteInChargeSearch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {staffList
              .filter((staff) =>
                staff.staff_name.toLowerCase().includes(siteInChargeSearch.toLowerCase())
              )
              .map((staff) => (
                <div
                  key={staff.id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      siteInCharge: staff.staff_name,
                      siteInChargeId: staff.id
                    }));
                    setIsSiteInChargeDropdownOpen(false);
                    setSiteInChargeSearch('');
                  }}
                >
                  {staff.staff_name}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
    <button
      type="button"
      onClick={() => setIsSiteInChargeModalOpen(true)}
      className="px-4 py-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors whitespace-nowrap"
    >
      New
    </button>
    <SiteInChargeModal/>
  </div>
</div>

            {/* Scheduled Hand Over Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 h-5 block">
                Scheduled Hand Over Date:
              </label>
              <input
                type="date"
                name="scheduledHandOverDate"
                value={formData.scheduledHandOverDate}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>
        </>
      )}

      {/* Unit Section */}
      <div className="pb-6 border-b">
        {/* Unit Selection Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 h-5 block">
              Unit <span className="text-red-500 ml-1">*</span> :
            </label>
            <div className="relative">
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                onClick={() => handleSelectClick('unit')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
              >
                <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Multiple">Multiple</option>
              </select>
              <IoChevronDownOutline
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none transition-transform duration-300 ${
                  openSelect === 'unit' ? 'rotate-180' : ''
                }`}
                size={20}
              />
            </div>
          </div>
        </div>

        {/* Unit Type Details - Works for both Single and Multiple */}
        {(formData.unit === 'Single' || formData.unit === 'Multiple') && (
          <div className="space-y-4 mt-6">
            {/* For Single, we'll have one item in unitDetails array */}
            {/* For Multiple, we can add more items */}
            {(formData.unit === 'Single'
              ? [{ type: formData.unitType || '' }]
              : formData.unitDetails
            ).map((detail, index) => (
              <div key={index} className="border rounded-lg p-4 relative">
                {/* Show delete button only for Multiple units after first item */}
                {formData.unit === 'Multiple' && index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveUnitType(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <IoCloseOutline size={24} />
                  </button>
                )}

                {/* Type Selection Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Type Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 h-5 block">
                      Type:
                    </label>
                    <div className="relative">
                      <select
                        value={detail.type}
                        onChange={(e) =>
                          formData.unit === 'Single'
                            ? handleInputChange({
                                target: {
                                  name: 'unitType',
                                  value: e.target.value,
                                },
                              })
                            : handleUnitTypeChange(index, e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                      >
                        <option value="">Select</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Building">Building</option>
                        <option value="Community Center">
                          Community Center
                        </option>
                        <option value="Labour Camp">Labour Camp</option>
                        <option value="Mall">Mall</option>
                        <option value="Swimming Pool">Swimming Pool</option>
                        <option value="Toilet">Toilet</option>
                        <option value="Villa">Villa</option>
                        <option value="Warehouse">Warehouse</option>
                        <option value="Other">Other</option>
                      </select>
                      <IoChevronDownOutline
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                        size={20}
                      />
                    </div>
                  </div>

                  {/* Type-specific fields */}
                  {detail.type && (
                    <>
                      {/* Fields for Apartment */}
                      {detail.type === 'Apartment' && (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 h-5 block">
                              Building No:
                            </label>
                            <input
                              type="text"
                              value={detail.buildingNo || ''}
                              onChange={(e) =>
                                handleUnitTypeDetailChange(
                                  index,
                                  'buildingNo',
                                  e.target.value
                                )
                              }
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 h-5 block">
                              Phase:
                            </label>
                            <div className="relative">
                              <select
                                value={detail.phase || ''}
                                onChange={(e) =>
                                  handleUnitTypeDetailChange(
                                    index,
                                    'phase',
                                    e.target.value
                                  )
                                }
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                              >
                                <option value="">Select</option>
                                <option value="N/A">N/A</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                              </select>
                              <IoChevronDownOutline
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                                size={20}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 h-5 block">
                              AP No:
                            </label>
                            <input
                              type="text"
                              value={detail.apNo || ''}
                              onChange={(e) =>
                                handleUnitTypeDetailChange(
                                  index,
                                  'apNo',
                                  e.target.value
                                )
                              }
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>

                          {/* Flat Type */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 h-5 block">
                              Flat Type:
                            </label>
                            <div className="relative">
                              <select
                                value={detail.flatType || ''}
                                onChange={(e) =>
                                  handleUnitTypeDetailChange(
                                    index,
                                    'flatType',
                                    e.target.value
                                  )
                                }
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                                style={{
                                  maxHeight: '200px',
                                  overflowY: 'auto',
                                }}
                              >
                                <option value="">Select</option>
                                <option value="1BHK">1BHK</option>
                                <option value="2BHK">2BHK</option>
                                <option value="3BHK">3BHK</option>
                                <option value="Studio">Studio</option>
                                <option value="Master">Master</option>
                                <option value="Guest">Guest</option>
                                <option value="Right">Right</option>
                                <option value="Left">Left</option>
                                <option value="Guest1">Guest1</option>
                                <option value="Guest2">Guest2</option>
                                <option value="Single">Single</option>
                              </select>
                              <IoChevronDownOutline
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                                size={20}
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {/* Fields for Building */}
                      {detail.type === 'Building' && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 h-5 block">
                            Building No:
                          </label>
                          <input
                            type="text"
                            value={detail.buildingNo || ''}
                            onChange={(e) =>
                              handleUnitTypeDetailChange(
                                index,
                                'buildingNo',
                                e.target.value
                              )
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                      )}

                      {/* Community Center fields */}
                      {detail.type === 'Community Center' && (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 h-5 block">
                              Community Center No:
                            </label>
                            <input
                              type="text"
                              value={detail.communityCenterNo || ''}
                              onChange={(e) =>
                                handleUnitTypeDetailChange(
                                  index,
                                  'communityCenterNo',
                                  e.target.value
                                )
                              }
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 h-5 block">
                              Type:
                            </label>
                            <div className="relative">
                              <select
                                value={detail.communityCenterType || ''}
                                onChange={(e) =>
                                  handleUnitTypeDetailChange(
                                    index,
                                    'communityCenterType',
                                    e.target.value
                                  )
                                }
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                              >
                                <option value="">Select</option>
                                <option value="G">G</option>
                                <option value="G + 1">G + 1</option>
                                <option value="G + 2">G + 2</option>
                                <option value="G + 3">G + 3</option>
                              </select>
                              <IoChevronDownOutline
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                                size={20}
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {/* Labour Camp fields */}
                      {detail.type === 'Labour Camp' && (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 h-5 block">
                              LC No:
                            </label>
                            <input
                              type="text"
                              value={detail.lcNo || ''}
                              onChange={(e) =>
                                handleUnitTypeDetailChange(
                                  index,
                                  'lcNo',
                                  e.target.value
                                )
                              }
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 h-5 block">
                              Location:
                            </label>
                            <div className="relative">
                              <select
                                value={detail.lcLocation || ''}
                                onChange={(e) =>
                                  handleUnitTypeDetailChange(
                                    index,
                                    'lcLocation',
                                    e.target.value
                                  )
                                }
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                              >
                                <option value="">Select</option>
                                <option value="South">South</option>
                                <option value="New West">New West</option>
                                <option value="New East">New East</option>
                              </select>
                              <IoChevronDownOutline
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                                size={20}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 h-5 block">
                              Room No:
                            </label>
                            <input
                              type="text"
                              value={detail.roomNo || ''}
                              onChange={(e) =>
                                handleUnitTypeDetailChange(
                                  index,
                                  'roomNo',
                                  e.target.value
                                )
                              }
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>
                        </>
                      )}

                      {/* Mall fields */}
                      {detail.type === 'Mall' && (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 h-5 block">
                              Mall No:
                            </label>
                            <input
                              type="text"
                              value={detail.mallNo || ''}
                              onChange={(e) =>
                                handleUnitTypeDetailChange(
                                  index,
                                  'mallNo',
                                  e.target.value
                                )
                              }
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 h-5 block">
                              Type:
                            </label>
                            <div className="relative">
                              <select
                                value={detail.mallType || ''}
                                onChange={(e) =>
                                  handleUnitTypeDetailChange(
                                    index,
                                    'mallType',
                                    e.target.value
                                  )
                                }
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                              >
                                <option value="">Select</option>
                                <option value="G">G</option>
                                <option value="G + 1">G + 1</option>
                                <option value="G + 2">G + 2</option>
                                <option value="G + 3">G + 3</option>
                              </select>
                              <IoChevronDownOutline
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                                size={20}
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {/* Swimming Pool fields */}
                      {detail.type === 'Swimming Pool' && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 h-5 block">
                            Swimming Pool No:
                          </label>
                          <input
                            type="text"
                            value={detail.swimmingPoolNo || ''}
                            onChange={(e) =>
                              handleUnitTypeDetailChange(
                                index,
                                'swimmingPoolNo',
                                e.target.value
                              )
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                      )}

                      {/* Villa fields */}
                      {detail.type === 'Villa' && (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 h-5 block">
                              Villa No:
                            </label>
                            <input
                              type="text"
                              value={detail.villaNo || ''}
                              onChange={(e) =>
                                handleUnitTypeDetailChange(
                                  index,
                                  'villaNo',
                                  e.target.value
                                )
                              }
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 h-5 block">
                              Villa Type:
                            </label>
                            <div className="relative">
                              <select
                                value={detail.villaType || ''}
                                onChange={(e) =>
                                  handleUnitTypeDetailChange(
                                    index,
                                    'villaType',
                                    e.target.value
                                  )
                                }
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                              >
                                <option value="">Select</option>
                                <option value="1 BHK">1 BHK</option>
                                <option value="2 BHK">2 BHK</option>
                                <option value="3 BHK">3 BHK</option>
                                <option value="4 BHK">4 BHK</option>
                                <option value="5 BHK">5 BHK</option>
                              </select>
                              <IoChevronDownOutline
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                                size={20}
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {/* Warehouse fields */}
                      {detail.type === 'Warehouse' && (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 h-5 block">
                              Warehouse No:
                            </label>
                            <input
                              type="text"
                              value={detail.warehouseNo || ''}
                              onChange={(e) =>
                                handleUnitTypeDetailChange(
                                  index,
                                  'warehouseNo',
                                  e.target.value
                                )
                              }
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 h-5 block">
                              Location:
                            </label>
                            <input
                              type="text"
                              value={detail.warehouseLocation || ''}
                              onChange={(e) =>
                                handleUnitTypeDetailChange(
                                  index,
                                  'warehouseLocation',
                                  e.target.value
                                )
                              }
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>
                        </>
                      )}

                      {/* Other fields */}
                      {detail.type === 'Other' && (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 h-5 block">
                              Reference No:
                            </label>
                            <input
                              type="text"
                              value={detail.referenceNo || ''}
                              onChange={(e) =>
                                handleUnitTypeDetailChange(
                                  index,
                                  'referenceNo',
                                  e.target.value
                                )
                              }
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 h-5 block">
                              Description:
                            </label>
                            <input
                              type="text"
                              value={detail.description || ''}
                              onChange={(e) =>
                                handleUnitTypeDetailChange(
                                  index,
                                  'description',
                                  e.target.value
                                )
                              }
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>
                        </>
                      )}

                      {/* Toilet fields */}
                      {detail.type === 'Toilet' && (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 h-5 block">
                              Toilet No:
                            </label>
                            <input
                              type="text"
                              value={detail.toiletNo || ''}
                              onChange={(e) =>
                                handleUnitTypeDetailChange(
                                  index,
                                  'toiletNo',
                                  e.target.value
                                )
                              }
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 h-5 block">
                              Type:
                            </label>
                            <div className="relative">
                              <select
                                value={detail.toiletType || ''}
                                onChange={(e) =>
                                  handleUnitTypeDetailChange(
                                    index,
                                    'toiletType',
                                    e.target.value
                                  )
                                }
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                              >
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Handicapped">Handicapped</option>
                              </select>
                              <IoChevronDownOutline
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                                size={20}
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {/* extra fields f the quotation s approved */}

                      {/* Common fields for all types when quotation status is Approved or Urgent */}
                      {(formData.quotationStatus === 'Approved' ||
                        formData.quotationStatus ===
                          'Approval Pending but Work Started on Urgent basis') && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 col-span-3">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 h-5 block">
                              Start Date:
                            </label>
                            <input
                              type="date"
                              value={detail.startDate || ''}
                              onChange={(e) =>
                                handleUnitTypeDetailChange(
                                  index,
                                  'startDate',
                                  e.target.value
                                )
                              }
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 h-5 block">
                              End Date:
                            </label>
                            <input
                              type="date"
                              value={detail.endDate || ''}
                              onChange={(e) =>
                                handleUnitTypeDetailChange(
                                  index,
                                  'endDate',
                                  e.target.value
                                )
                              }
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 h-5 block">
                              Work Status:
                            </label>
                            <div className="relative">
                              <select
                                value={detail.workStatus || ''}
                                onChange={(e) =>
                                  handleUnitTypeDetailChange(
                                    index,
                                    'workStatus',
                                    e.target.value
                                  )
                                }
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                              >
                                <option value="">Select</option>
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                              </select>
                              <IoChevronDownOutline
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                                size={20}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}

            {/* Add Type Button - Only show for Multiple */}
            {formData.unit === 'Multiple' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddUnitType}
                  className="px-4 py-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  Add Type
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Additional Fields*/}
      {(formData.quotationStatus === 'Approved' ||
        formData.quotationStatus ===
          'Approval Pending but Work Started on Urgent basis') && (
        <>
          {/* LPO and PR Section */}
          <div className="space-y-6 border-b pb-6">
            {/* All LPO related fields */}
            <div className="space-y-4">
              {/* First row - Only LPO Number */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* LPO Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 h-5 block">
                    LPO Number:
                  </label>
                  <div className="relative">
                    <select
                      name="lpoNumber"
                      value={formData.lpoNumber}
                      onChange={handleLPOChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                    >
                      <option value="">Select</option>
                      <option value="Single">Single</option>
                      <option value="Partial">Partial</option>
                    </select>
                    <IoChevronDownOutline
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                      size={20}
                    />
                  </div>
                </div>
              </div>

              {/* Single LPO Fields */}
              {formData.lpoNumber === 'Single' && (
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Default LPO Status */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 h-5 block">
                        LPO Status:
                      </label>
                      <div className="relative">
                        <select
                          name="lpoStatus"
                          value={formData.lpoStatus}
                          onChange={handleLPOChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                        >
                          <option value="">Select</option>
                          <option value="Pending">Pending</option>
                          <option value="Received">Received</option>
                        </select>
                        <IoChevronDownOutline
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                          size={20}
                        />
                      </div>
                    </div>

                    {/* Default PR No */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 h-5 block">
                        PR No:
                      </label>
                      <input
                        type="text"
                        name="prNo"
                        value={formData.prNo}
                        onChange={handleLPOChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Additional fields when LPO Status is Received */}
                  {formData.lpoStatus === 'Received' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                      {/* LPO No */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          LPO No:
                        </label>
                        <input
                          type="text"
                          name="lpoNo"
                          value={formData.lpoNo}
                          onChange={handleLPOChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>

                      {/* LPO Amount */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          LPO Amount:
                        </label>
                        <input
                          type="number"
                          name="lpoAmount"
                          value={formData.lpoAmount}
                          onChange={handleLPOChange}  // Changed from handleLPODetailChange
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>

                      {/* Date */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Date:
                        </label>
                        <input
                          type="date"
                          name="lpoDate"
                          value={formData.lpoDate}
                          onChange={handleLPOChange}  // Changed from handleLPODetailChange
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Partial LPO Details */}
              {formData.lpoNumber === 'Partial' && (
                <div className="space-y-4">
                  {formData.lpoDetails.map((detail, index) => (
  <div key={index} className="border rounded-lg p-4 relative">
    {/* Delete button for additional LPO details */}
    {index > 0 && (
      <button
        type="button"
        onClick={() => handleRemoveLPO(index)}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
      >
        <IoCloseOutline size={24} />
      </button>
    )}

    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LPO Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            LPO Status:
          </label>
          <div className="relative">
            <select
              value={detail.lpoStatus}
              onChange={(e) =>
                handleLPODetailChange(index, 'lpoStatus', e.target.value)
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
            >
              <option value="">Select</option>
              <option value="Pending">Pending</option>
              <option value="Received">Received</option>
            </select>
            <IoChevronDownOutline
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              size={20}
            />
          </div>
        </div>

        {/* PR No */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            PR No:
          </label>
          <input
            type="text"
            value={detail.prNo || ''}
            onChange={(e) =>
              handleLPODetailChange(index, 'prNo', e.target.value)
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        {/* LPO No */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            LPO No:
          </label>
          <input
            type="text"
            value={detail.lpoNo || ''}
            onChange={(e) =>
              handleLPODetailChange(index, 'lpoNo', e.target.value)
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        {/* LPO Amount */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            LPO Amount:
          </label>
          <input
            type="number"
            value={detail.lpoAmount || ''}
            onChange={(e) =>
              handleLPODetailChange(index, 'lpoAmount', e.target.value)
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Date:
          </label>
          <input
            type="date"
            value={detail.date || ''}
            onChange={(e) =>
              handleLPODetailChange(index, 'date', e.target.value)
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>
    </div>
  </div>
))}
                  {/* Add LPO Button */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleAddLPO}
                      className="px-4 py-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      Add LPO
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* WCR Status Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b">
            {/* WCR Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 h-5 block">
                WCR Status:
              </label>
              <div className="relative">
                <select
                  name="wcrStatus"
                  value={formData.wcrStatus}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                >
                  <option value="">Select</option>
                  <option value="Pending">Pending</option>
                  <option value="Not Applicable">Not Applicable</option>
                  <option value="Submitted">Submitted</option>
                </select>
                <IoChevronDownOutline
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  size={20}
                />
              </div>
            </div>

            {/* Attachment fields when WCR Status is Submitted */}
            {formData.wcrStatus === 'Submitted' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 h-5 block">
                  Attachment:
                </label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    className="hidden"
                    id="wcrAttachment"
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        wcrAttachment: e.target.files[0],
                      }));
                    }}
                  />
                  <label
                    htmlFor="wcrAttachment"
                    className="flex-1 cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-all hover:border-blue-500 hover:text-blue-500"
                  >
                    {formData.wcrAttachment ? (
                      <>
                        <IoDocumentOutline size={20} />
                        <span className="truncate">
                          {formData.wcrAttachment.name}
                        </span>
                      </>
                    ) : (
                      <>
                        <IoCloudUploadOutline size={20} />
                        <span>Choose File</span>
                      </>
                    )}
                  </label>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                      formData.wcrAttachment
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    }`}
                    disabled={!formData.wcrAttachment}
                  >
                    <IoCheckmarkCircleOutline size={20} />
                    Submit
                  </button>
                </div>
                {formData.wcrAttachment && (
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <IoDocumentOutline size={16} />
                    Selected: {formData.wcrAttachment.name}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Invoice Section */}
          <div className="space-y-6 border-b pb-6">
            {/* Invoice Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 h-5 block">
                  Invoice:
                </label>
                <div className="relative">
                  <select
                    name="invoice"
                    value={formData.invoice}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                  >
                    <option value="">Select</option>
                    <option value="Single">Single</option>
                    <option value="Partial">Partial</option>
                  </select>
                  <IoChevronDownOutline
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>

              {/* Invoice Status */}
              {formData.invoice && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 h-5 block">
                    Invoice Status:
                  </label>
                  <div className="relative">
                    <select
                      name="invoiceStatus"
                      value={formData.invoiceStatus}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Submitted">Submitted</option>
                    </select>
                    <IoChevronDownOutline
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                      size={20}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Invoice Details */}
            {formData.invoice && formData.invoiceStatus === 'Submitted' && (
              <div className="space-y-4">
                {formData.invoiceDetails.map((detail, index) => (
                  <div key={index} className="border rounded-lg p-4 relative">
                    {/* Delete button for additional invoice details */}
                    {formData.invoice === 'Partial' && index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveInvoice(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <IoCloseOutline size={24} />
                      </button>
                    )}

                    <div className="space-y-4">
                      {/* First row with Invoice No, Date, Amount */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Invoice No:
                          </label>
                          <input
                            type="text"
                            value={detail.invoiceNo}
                            onChange={(e) =>
                              handleInvoiceDetailChange(
                                index,
                                'invoiceNo',
                                e.target.value
                              )
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Invoice Date:
                          </label>
                          <input
                            type="date"
                            value={detail.invoiceDate}
                            onChange={(e) =>
                              handleInvoiceDetailChange(
                                index,
                                'invoiceDate',
                                e.target.value
                              )
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Invoice Amount:
                          </label>
                          <input
                            type="number"
                            value={detail.invoiceAmount}
                            onChange={(e) =>
                              handleInvoiceDetailChange(
                                index,
                                'invoiceAmount',
                                e.target.value
                              )
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Second row with GRN Status and Retention */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* GRN Status */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            GRN Status:
                          </label>
                          <div className="relative">
                            <select
                              value={detail.grnStatus}
                              onChange={(e) =>
                                handleInvoiceDetailChange(
                                  index,
                                  'grnStatus',
                                  e.target.value
                                )
                              }
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Received">Received</option>
                              <option value="Not Applicable">
                                Not Applicable
                              </option>
                            </select>
                            <IoChevronDownOutline
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                              size={20}
                            />
                          </div>
                        </div>

                        {/* GRN Details when status is Received */}
                        {detail.grnStatus === 'Received' && (
                          <>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                GRN No:
                              </label>
                              <input
                                type="text"
                                value={detail.grnNo || ''}
                                onChange={(e) =>
                                  handleInvoiceDetailChange(
                                    index,
                                    'grnNo',
                                    e.target.value
                                  )
                                }
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                GRN Date:
                              </label>
                              <input
                                type="date"
                                value={detail.grnDate || ''}
                                onChange={(e) =>
                                  handleInvoiceDetailChange(
                                    index,
                                    'grnDate',
                                    e.target.value
                                  )
                                }
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                              />
                            </div>
                          </>
                        )}

                        {/* Retention */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Retention:
                          </label>
                          <div className="relative">
                            <select
                              value={detail.retention}
                              onChange={(e) =>
                                handleInvoiceDetailChange(
                                  index,
                                  'retention',
                                  e.target.value
                                )
                              }
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                            >
                              <option value="Not Applicable">
                                Not Applicable
                              </option>
                              <option value="Applicable">Applicable</option>
                            </select>
                            <IoChevronDownOutline
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                              size={20}
                            />
                          </div>
                        </div>

                        {/* Amount (shows up next to Retention) */}
                        {detail.retention === 'Applicable' && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              Amount:
                            </label>
                            <input
                              type="number"
                              value={detail.retentionAmount}
                              onChange={(e) =>
                                handleInvoiceDetailChange(
                                  index,
                                  'retentionAmount',
                                  e.target.value
                                )
                              }
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                          </div>
                        )}
                      </div>

                      {/* Second row with Due After, Due Date, and Retention Invoice */}
                      {detail.retention === 'Applicable' && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                            {/* Due After */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Due After:
                              </label>
                              <div className="relative">
                                <select
                                  value={detail.dueAfter}
                                  onChange={(e) =>
                                    handleInvoiceDateChange(
                                      index,
                                      'dueAfter',
                                      e.target.value
                                    )
                                  }
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                                >
                                  <option value="">Select</option>
                                  <option value="1 Year">1 Year</option>
                                  <option value="2 Years">2 Years</option>
                                  <option value="3 Years">3 Years</option>
                                </select>
                                <IoChevronDownOutline
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                                  size={20}
                                />
                              </div>
                            </div>

                            {/* Due Date */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Due Date:
                              </label>
                              <input
                                type="date"
                                value={detail.dueDate || ''}
                                readOnly
                                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                              />
                            </div>

                            {/* Retention Invoice */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Retention Invoice:
                              </label>
                              <div className="relative">
                                <select
                                  value={detail.retentionInvoice}
                                  onChange={(e) =>
                                    handleInvoiceDetailChange(
                                      index,
                                      'retentionInvoice',
                                      e.target.value
                                    )
                                  }
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Submitted">Submitted</option>
                                </select>
                                <IoChevronDownOutline
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                                  size={20}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Third row - Additional fields when Retention Invoice is Submitted */}
                          {detail.retentionInvoice === 'Submitted' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                              {/* Invoice Date */}
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                  Invoice Date:
                                </label>
                                <input
                                  type="date"
                                  value={detail.retentionInvoiceDate}
                                  onChange={(e) =>
                                    handleInvoiceDetailChange(
                                      index,
                                      'retentionInvoiceDate',
                                      e.target.value
                                    )
                                  }
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                              </div>

                              {/* Invoice No */}
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                  Invoice No:
                                </label>
                                <input
                                  type="text"
                                  value={detail.retentionInvoiceNo}
                                  onChange={(e) =>
                                    handleInvoiceDetailChange(
                                      index,
                                      'retentionInvoiceNo',
                                      e.target.value
                                    )
                                  }
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                              </div>

                              {/* Amount */}
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                  Amount:
                                </label>
                                <input
                                  type="number"
                                  value={detail.retentionInvoiceAmount}
                                  onChange={(e) =>
                                    handleInvoiceDetailChange(
                                      index,
                                      'retentionInvoiceAmount',
                                      e.target.value
                                    )
                                  }
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add Invoice Button for Partial */}
                {formData.invoice === 'Partial' && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleAddInvoice}
                      className="px-4 py-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      Add Invoice
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Save and Continue Button */}
      <div className="flex justify-end pt-6">
        <button
          type="button"
          onClick={handleSaveAndContinue}
          className="px-6 py-2.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all"
        >
          Save and Continue
        </button>
      </div>

      {showProducts && (
        <div className="mt-8 border-t pt-8">
          <ProductDetails optionValue={option} />
        </div>
      )}

      <div className="border-t pt-6">
        <TermsAndConditions />
      </div>
    </div>
  );
};

export default WorkDetails;
