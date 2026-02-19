/** 공복 시 허용 음식/음료 */
export const ALLOWED_ITEMS = [
  { id: '1', name: '물', description: '충분히 마시세요' },
  { id: '2', name: '블랙커피', description: '설탕/크림 없이' },
  { id: '3', name: '녹차/홍차', description: '무가당' },
  { id: '4', name: '탄산수', description: '무가당, 무향' },
  { id: '5', name: '애플사이다 비니거', description: '1~2 티스푼' },
];

/** 공복 시 금지 음식/음료 */
export const FORBIDDEN_ITEMS = [
  { id: '1', name: '우유/라떼', description: '칼로리 포함' },
  { id: '2', name: '과일주스', description: '당분 포함' },
  { id: '3', name: '다이어트 음료', description: '인슐린 반응 유발 가능' },
  { id: '4', name: '간식/과자', description: '어떤 고형식이든 금지' },
  { id: '5', name: '영양제(젤리형)', description: '칼로리 포함된 것' },
];

/** 추천 식사 시간대 */
export const RECOMMENDED_EATING_WINDOWS = [
  {
    id: '1',
    title: '점심 중심형 (권장)',
    timeRange: '오전 11시 ~ 오후 7시',
    description: '가장 실천하기 쉬운 패턴. 아침을 건너뛰고 점심, 저녁 식사',
  },
  {
    id: '2',
    title: '이른 저녁형',
    timeRange: '오전 10시 ~ 오후 6시',
    description: '저녁 약속이 적은 분께 추천. 일찍 자는 습관과 병행',
  },
  {
    id: '3',
    title: '늦은 점심형',
    timeRange: '오후 12시 ~ 오후 8시',
    description: '저녁 식사가 중요한 분께 추천. 야근이 잦은 직장인',
  },
];

/** 주의사항 */
export const WARNINGS = [
  {
    id: '1',
    title: '의사와 상담이 필요한 경우',
    items: [
      '당뇨병 환자 (특히 인슐린 사용자)',
      '임산부 또는 수유 중인 여성',
      '섭식 장애 이력이 있는 분',
      '만성 질환 또는 복용 중인 약이 있는 경우',
    ],
  },
  {
    id: '2',
    title: '단식을 피해야 하는 경우',
    items: [
      '성장기 어린이 및 청소년',
      '저체중 또는 영양실조 상태',
      '65세 이상 고령자 (의사 상담 권장)',
    ],
  },
  {
    id: '3',
    title: '주의해야 할 점',
    items: [
      '장기간 무리한 단식은 근손실 유발 가능',
      '충분한 단백질 섭취로 근육량 유지',
      '어지러움, 두통 시 즉시 중단',
      '물은 단식 중에도 충분히 섭취',
    ],
  },
];

/** FAQ */
export const FAQ_ITEMS = [
  {
    id: '1',
    question: '단식 중 운동해도 되나요?',
    answer: '가벼운 유산소 운동은 괜찮습니다. 고강도 운동은 식사 후에 하는 것을 권장합니다.',
  },
  {
    id: '2',
    question: '약은 복용해도 되나요?',
    answer: '대부분의 약은 공복에 복용 가능하지만, 식후 복용 약은 식사 시간에 맞춰 드세요.',
  },
  {
    id: '3',
    question: '단식 중 배고픔을 어떻게 참나요?',
    answer: '물이나 블랙커피를 마시면 도움이 됩니다. 보통 2주 정도 적응 기간이 필요합니다.',
  },
  {
    id: '4',
    question: '주말에는 쉬어도 되나요?',
    answer: '일관성이 중요하지만, 주 5일만 실천해도 효과가 있습니다. 유연하게 적용하세요.',
  },
];
