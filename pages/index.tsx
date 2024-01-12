import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { 
  MediaRenderer, 
  Web3Button, 
  useActiveClaimConditionForWallet, 
  useAddress, 
  useClaimIneligibilityReasons, 
  useContract, 
  useContractMetadata, 
  useTotalCirculatingSupply, 
  useTotalCount 
} from "@thirdweb-dev/react";
import { CONTRACT_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useState } from "react";

import Image from 'next/image'
import Link from 'next/link'
import gif from '../public/Gif.gif'


const Home: NextPage = () => {
  const address = useAddress();
  const router = useRouter();
  const maxClaimQuantity = 2;

  const {
    contract
  } = useContract(CONTRACT_ADDRESS);

  const {
    data: ContractMetadata,
    isLoading: isContractMetadataLoading,
  } = useContractMetadata(contract);

  const {
    data: activeClaimPhase,
    isLoading: isActiveClaimPhaseLoading,
  } = useActiveClaimConditionForWallet(contract, address);

  const {
    data: claimIneligibilityReasons,
    isLoading: isClaimIneligibilityReasonsLoading,
  } = useClaimIneligibilityReasons(
    contract,
    {
      walletAddress: address || "",
      quantity: 1,
    }
  );

  const {
    data: totalSupply,
    isLoading: isTotalSupplyLoading,
  } = useTotalCount(contract);
  const {
    data: totalClaimSupply,
    isLoading: isTotalClaimSupplyLoading,
  } = useTotalCirculatingSupply(contract);

  

  const [claimQuantity, setClaimQuantity] = useState(1);
  const increment = () => {
    if (claimQuantity < maxClaimQuantity) {
      setClaimQuantity(claimQuantity + 1);
    }
  };
  const decrement = () => {
    if (claimQuantity > 1) {
      setClaimQuantity(claimQuantity - 1);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {!isContractMetadataLoading && (
          <div className={styles.heroSection}>
            <div className={styles.collectionImage}>
              <Image
                src={gif}
                width={225}
                height={225}
                alt="The Palestinians"
              />
            </div>
            <div>
              <h1>{ContractMetadata!.name}</h1>
              <p>{ContractMetadata!.description}</p>
              {!isActiveClaimPhaseLoading ? (
                <div>
                  <p>Claim Phase: {activeClaimPhase?.metadata?.name}</p>
                  <p>Price: {ethers.utils.formatUnits(activeClaimPhase?.price!)}</p>
                </div>
              ) : (
                <p>Loading...</p>
              )}
              {!isTotalSupplyLoading && !isTotalClaimSupplyLoading ? (
                <p>Claimed: {totalClaimSupply?.toNumber()} / {totalSupply?.toNumber()}</p>
              ) : (
                <p>Loading...</p>
              )}
              {address ? (
                !isClaimIneligibilityReasonsLoading ? (
                  claimIneligibilityReasons?.length! > 0 ? (
                    claimIneligibilityReasons?.map((reason, index) => (
                      <p key={index}>{reason}</p>
                    ))
                  ) : (
                    <div>
                      <p>Eligible to claim</p>
                      <div className={styles.claimContainer}>
                        <div className={styles.claimValue}>
                          <button
                            className={styles.claimBtn}
                            onClick={decrement}
                          >-</button>
                          <input
                            className={styles.claimInput}
                            type="number"
                            value={claimQuantity}
                          />
                          <button
                            className={styles.claimBtn}
                            onClick={increment}
                          >+</button>
                          <Web3Button
                            className={styles.Web3Button}
                            contractAddress={CONTRACT_ADDRESS}
                            action={(contract) =>  contract.erc721.claim(claimQuantity)}
                            onSuccess={() => router.push(`/profile/${address}`)}
                          >CLAIM</Web3Button>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <p>Checking Eligibility...</p>
                )
              ) : (
                <p>Connect Wallet to claim</p>
              )}
              <div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
  
    
};

export default Home;
