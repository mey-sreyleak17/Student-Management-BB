import React, { useState, useEffect } from 'react';
import { Button, Modal, Spin, Result } from 'antd';
import axios from 'axios';

const ABAPayment = () => {
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('none'); // none, pending, success
    const [qrData, setQrData] = useState(null);

    const handleCheckout = async () => {
        setLoading(true);
        const tranId = "TRX-" + Date.now(); // បង្កើត ID មិនឱ្យស្ទួន
        
        try {
            const res = await axios.post('/api/create-payment', { amount: "1.00", tran_id: tranId });
            setQrData(res.data);
            setPaymentStatus('pending');
            
            // បើក Form បង់ប្រាក់ទៅ ABA (ជាធម្មតាប្រើការ Submit Form ទៅកាន់ ABA Checkout)
            // ឬប្រើ API របស់គេដើម្បីទាញយក qrString មក Generate ខ្លួនឯង
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    // រង្វង់នៃការឆែក Status (Polling)
    useEffect(() => {
        let timer;
        if (paymentStatus === 'pending') {
            timer = setInterval(async () => {
                const res = await axios.get(`/api/check-status/${qrData.tran_id}`);
                if (res.data.status === 'paid') {
                    setPaymentStatus('success');
                    clearInterval(timer);
                }
            }, 3000); // ឆែករៀងរាល់ ៣ វិនាទី
        }
        return () => clearInterval(timer);
    }, [paymentStatus, qrData]);

    return (
        <div style={{ padding: 50, textAlign: 'center' }}>
            <Button type="primary" onClick={handleCheckout} loading={loading}>
                បង់ប្រាក់ឥឡូវនេះ (1.00$)
            </Button>

            <Modal open={paymentStatus !== 'none'} footer={null} onCancel={() => setPaymentStatus('none')}>
                {paymentStatus === 'pending' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2>សូមស្កេន KHQR ដើម្បីបង់ប្រាក់</h2>
                        <div id="aba_qr_container">
                            {/* បង្ហាញរូបភាព QR នៅទីនេះ */}
                            <Spin tip="រង់ចាំការបង់ប្រាក់..." size="large" />
                        </div>
                    </div>
                )}
                {paymentStatus === 'success' && (
                    <Result status="success" title="ការទូទាត់ទទួលបានជោគជ័យ!" />
                )}
            </Modal>
        </div>
    );
};

export default ABAPayment;