import ConfirmModal from '../common/ConfirmModal'

type Category = {
  id: string
  name: string
}

type CategoryDeleteConfirmProps = {
  category: Category | null
  onCancel: () => void
  onConfirm: () => void
}

export default function CategoryDeleteConfirm({ category, onCancel, onConfirm }: CategoryDeleteConfirmProps) {
  return (
    <ConfirmModal
      cancelText="취소"
      confirmText="삭제"
      description={`'${category?.name}' 카테고리를 삭제할까요? 기존 내역의 카테고리는 그대로 유지돼요.`}
      isOpen={category !== null}
      onClose={onCancel}
      onConfirm={onConfirm}
      title="카테고리 삭제"
    />
  )
}
