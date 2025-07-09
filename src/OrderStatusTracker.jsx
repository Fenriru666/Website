// src/components/OrderStatusTracker.jsx
import React from 'react';

// Định nghĩa các icon cho từng bước
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PendingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 20v-5h-5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8v0a8 8 0 018 8v0a8 8 0 01-8 8v0a8 8 0 01-8-8v0z" /></svg>;
const InProgressIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CancelledIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


function OrderStatusTracker({ currentStatus }) {
    // Các bước trong tiến trình đơn hàng
    const steps = [
        { status: 'Pending', label: 'Chờ xác nhận' },
        { status: 'Preparing', label: 'Đang chuẩn bị' },
        { status: 'Shipped', label: 'Đang giao hàng' },
        { status: 'Completed', label: 'Giao thành công' }
    ];

    // Xử lý riêng cho trường hợp đơn hàng bị hủy
    if (currentStatus === 'Cancelled') {
        return (
            <div className="flex items-center p-4 bg-red-50 text-red-700 rounded-lg">
                <CancelledIcon />
                <span className="ml-3 font-semibold">Đơn hàng đã bị hủy.</span>
            </div>
        );
    }
    
    const currentStepIndex = steps.findIndex(step => step.status === currentStatus);
    // THAY ĐỔI LOGIC TẠI ĐÂY: Thêm biến để kiểm tra quy trình đã kết thúc chưa
    const isProcessFinished = currentStatus === 'Completed';

    return (
        <div className="w-full py-4 px-2">
            <div className="flex justify-between items-center">
                {steps.map((step, index) => {
                    // THAY ĐỔI LOGIC TẠI ĐÂY:
                    // 1. Một bước được coi là 'hoàn thành' nếu index của nó nhỏ hơn bước hiện tại, HOẶC nếu toàn bộ quy trình đã kết thúc.
                    const isCompleted = index < currentStepIndex || isProcessFinished;
                    // 2. Một bước chỉ 'đang hoạt động' nếu index của nó bằng bước hiện tại VÀ quy trình chưa kết thúc.
                    const isActive = index === currentStepIndex && !isProcessFinished;
                    const isLastStep = index === steps.length - 1;

                    return (
                        <React.Fragment key={step.status}>
                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white
                                    ${isCompleted ? 'bg-green-500' : ''}
                                    ${isActive ? 'bg-orange-500' : ''}
                                    ${!isCompleted && !isActive ? 'bg-gray-300' : ''}
                                `}>
                                    {isCompleted ? <CheckCircleIcon/> : (isActive ? <PendingIcon/> : <InProgressIcon/>)}
                                </div>
                                <p className={`mt-2 text-xs text-center font-semibold 
                                    ${isActive ? 'text-orange-600' : 'text-gray-600'}
                                `}>
                                    {step.label}
                                </p>
                            </div>
                            
                            {!isLastStep && (
                                <div className={`flex-1 h-1 mx-2 
                                    ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}
                                `}></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}

export default OrderStatusTracker;