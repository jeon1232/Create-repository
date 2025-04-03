
import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

const mockDB = {
  customers: {
    "010-1234-5678": { phoneNumber: "010-1234-5678", lastVisit: Date.now() - 86400000 },
    "010-9876-5432": { phoneNumber: "010-9876-5432", lastVisit: Date.now() - 172800000 },
  },
  stamps: [
    { id: 1, phoneNumber: "010-1234-5678", earnedDate: Date.now() - 86400000, usedDate: null },
    { id: 2, phoneNumber: "010-1234-5678", earnedDate: Date.now() - 86400000, usedDate: null },
    { id: 3, phoneNumber: "010-9876-5432", earnedDate: Date.now() - 172800000, usedDate: Date.now() - 86400000 },
  ],
};

const getAllCustomers = () => Object.values(mockDB.customers);
const getCustomerStamps = (phone) => mockDB.stamps.filter((s) => s.phoneNumber === phone);
const deleteCustomerStamps = (phone) => {
  mockDB.stamps = mockDB.stamps.filter((s) => s.phoneNumber !== phone);
};
const sendRandomEventText = (phone) => {
  const events = [
    "🎉 축하합니다! 특별 이벤트에 당첨되셨습니다!",
    "🎁 오늘의 럭키 고객! 추가 스탬프를 드립니다!",
    "✨ 깜짝 할인 쿠폰이 도착했어요!",
    "🎊 무료 음료 쿠폰이 기다리고 있어요!",
  ];
  const message = events[Math.floor(Math.random() * events.length)];
  alert(`문자 전송 (${phone}):\n\n${message}`);
};

export default function AdminPanel() {
  const [customerList, setCustomerList] = useState([]);
  const [expandedCustomer, setExpandedCustomer] = useState(null);

  useEffect(() => {
    const list = getAllCustomers();
    setCustomerList(list);
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">👤 관리자 화면 - 전체 고객 목록</h1>

      {customerList.length === 0 && <p>등록된 고객이 없습니다.</p>}

      {customerList.map((customer) => {
        const stamps = getCustomerStamps(customer.phoneNumber);
        return (
          <div
            key={customer.phoneNumber}
            className="border rounded-lg p-4 shadow bg-white space-y-2"
          >
            <p>📱 전화번호: {customer.phoneNumber}</p>
            <p>📅 마지막 방문: {formatDistanceToNow(new Date(customer.lastVisit))} 전</p>
            <p>🔢 총 스탬프 수: {stamps.length}</p>

            <div className="flex flex-wrap gap-2">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() =>
                  setExpandedCustomer(
                    expandedCustomer === customer.phoneNumber ? null : customer.phoneNumber
                  )
                }
              >
                {expandedCustomer === customer.phoneNumber ? "내역 닫기" : "적립 내역 보기"}
              </button>

              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => {
                  if (confirm("정말 이 고객의 스탬프 내역을 삭제하시겠습니까?")) {
                    deleteCustomerStamps(customer.phoneNumber);
                    setExpandedCustomer(null);
                    alert("스탬프 내역이 삭제되었습니다.");
                  }
                }}
              >
                스탬프 내역 삭제
              </button>

              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded"
                onClick={() => sendRandomEventText(customer.phoneNumber)}
              >
                🎈 이벤트 문자 발송
              </button>
            </div>

            {expandedCustomer === customer.phoneNumber && (
              <div className="pt-2 space-y-1">
                {stamps.length === 0 ? (
                  <p className="text-sm">적립 내역이 없습니다.</p>
                ) : (
                  stamps.map((s) => (
                    <div
                      key={s.id}
                      className="text-sm border-b pb-1 flex justify-between"
                    >
                      <span>📅 {new Date(s.earnedDate).toLocaleDateString()}</span>
                      <span>{s.usedDate ? "✅ 사용됨" : "🕓 미사용"}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
