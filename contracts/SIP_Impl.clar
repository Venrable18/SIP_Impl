
;;Use the NFT trait
(use-trait nft-trait .nft-trait-v2.nft-trait)

;;Implement the SIP-009 NFT trait
(impl-trait .nft-trait-v2.nft-trait)

;;Variables Definition
(define-non-fungible-token Sacasm uint)

(define-data-var  last-token-id uint u0)

(define-data-var base-uri (string-ascii 114) "https://orange-official-walrus-920.mypinata.cloud/ipfs/bafkreiejb6tl4fnmbnypg37wg6k55nul3gqcxgioay5qdifct6q7cs62cy")

;;Constants Definition
(define-constant CONTRACT_OWNER tx-sender)

(define-constant COLLECTION_LIMIT u1000)

(define-constant ERR_OWNER_ONLY (err u100))

(define-constant ERR_NOT_TOKEN_OWNER (err u101))

(define-constant ERR_SOLD_OUT (err u300))

(define-constant ERR_INVALID_URI (err u104))

(define-constant ERR_INVALID_COLLECTION_LIMIT (err u105))

(define-constant ERR_INVALID_TOKEN_ID (err u107))

(define-constant ERR_INVALID_RECIPIENT (err u108))


;;Functions Definition
(define-read-only (get-last-token-id) (ok (var-get last-token-id)))

(define-read-only (get-token-uri (token-id uint)) (ok (some (var-get base-uri))))

(define-read-only (get-owner (token-id uint)) 
(ok (nft-get-owner? Sacasm token-id))
)


;;Transfer Function
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
    (begin
        (asserts! (is-eq tx-sender sender) ERR_NOT_TOKEN_OWNER)
        (asserts! (> token-id u0) ERR_INVALID_TOKEN_ID) ;; Validate token-id is positive
        (asserts! (<= token-id (var-get last-token-id)) ERR_INVALID_TOKEN_ID) ;; Token must exist
        (asserts! (not (is-eq recipient sender)) ERR_INVALID_RECIPIENT) ;; Prevent self-transfer
        (try! (nft-transfer? Sacasm token-id sender recipient))
        (ok true)
    )
)

;;Minting token
(define-public (mint (recipient principal))
    (let ((token-id (+ (var-get last-token-id) u1)))
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
    (asserts! (not (is-eq recipient tx-sender)) ERR_INVALID_RECIPIENT)
    (try! (nft-mint? Sacasm token-id recipient))
    (var-set  last-token-id token-id)
    (ok token-id)
    )
)


